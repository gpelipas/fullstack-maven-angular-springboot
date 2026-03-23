FROM eclipse-temurin:17-jre-alpine
# FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

ARG JAR_FILE

COPY dist/${JAR_FILE} /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
