# --- Stage 1: Full build via Maven 
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY frontend/pom.xml ./frontend/
COPY backend/pom.xml ./backend/

RUN mvn dependency:go-offline -B

COPY frontend/ ./frontend/
COPY backend/ ./backend/

RUN mvn package -DskipTests

# --- Stage 2: Minimal runtime image ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]



# FROM eclipse-temurin:17-jre-alpine
# # FROM eclipse-temurin:21-jre-alpine

# WORKDIR /app

# ARG JAR_FILE

# COPY dist/${JAR_FILE} /app/app.jar

# EXPOSE 8080

# CMD ["java", "-jar", "/app/app.jar"]
