# Build stage using Maven + OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build package
COPY src ./src
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

<<<<<<< HEAD

=======
>>>>>>> 6a2b3ce (chore: clean Dockerfile)
