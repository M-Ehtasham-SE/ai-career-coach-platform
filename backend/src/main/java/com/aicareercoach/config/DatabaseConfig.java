package com.aicareercoach.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

import org.springframework.context.annotation.Profile;

/**
 * Custom DataSource configuration for Production / Render deployment.
 *
 * Render injects DATABASE_URL in the format:
 *   postgresql://user:password@host/dbname
 *
 * JDBC drivers require the URL to start with "jdbc:postgresql://".
 * This class automatically sanitizes DATABASE_URL, prepends "jdbc:",
 * and extracts username and password if embedded in the URI.
 */
@Configuration
@Profile("!test")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${SPRING_DATASOURCE_URL:${DATABASE_URL:jdbc:postgresql://localhost:5432/ai_career_coach}}")
    private String rawDatabaseUrl;

    @Value("${spring.datasource.username:${DB_USERNAME:postgres}}")
    private String rawUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:Psql@1234}}")
    private String rawPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = rawDatabaseUrl;
        String username = rawUsername;
        String password = rawPassword;

        log.info("Sanitizing Database URL for Spring Boot...");

        if (url != null && !url.isBlank()) {
            // Convert postgresql:// or postgres:// to valid jdbc:postgresql://
            if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
                try {
                    String schemeReplacement = url.startsWith("postgres://") ? "postgres://" : "postgresql://";
                    String uriString = url.replaceFirst(schemeReplacement, "http://");

                    URI uri = new URI(uriString);

                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();

                    url = "jdbc:postgresql://" + host + ":" + port + path;

                    if (uri.getUserInfo() != null) {
                        String[] userPass = uri.getUserInfo().split(":", 2);
                        if (username == null || username.isBlank() || "postgres".equals(username)) {
                            username = userPass[0];
                        }
                        if ((password == null || password.isBlank() || "Psql@1234".equals(password)) && userPass.length > 1) {
                            password = userPass[1];
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to parse URI from raw DATABASE_URL, prepending 'jdbc:' as fallback: {}", e.getMessage());
                    url = "jdbc:" + url;
                }
            }
        }

        log.info("Final Sanitized JDBC URL: {}", url);

        DataSourceBuilder<?> builder = DataSourceBuilder.create()
                .url(url)
                .driverClassName("org.postgresql.Driver");

        if (username != null && !username.isBlank()) {
            builder.username(username);
        }
        if (password != null && !password.isBlank()) {
            builder.password(password);
        }

        return builder.build();
    }
}
