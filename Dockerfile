# Build stage using Maven + OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml from backend folder and download dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy source code from backend folder and build package
COPY backend/src ./src
RUN mvn package -DskipTests

# Run stage using lightweight Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/ai-career-coach-0.0.1-SNAPSHOT.jar app.jar

# Render injects PORT dynamically (default 8080)
EXPOSE 8080

# Run Spring Boot app with production profile
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
