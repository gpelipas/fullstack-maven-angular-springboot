# Fullstack Monorepo project - Multi-Module Maven, Frontend(Angular) and Backend (Spring Boot)

A **multi-module Maven project** that produces a **single runnable Spring Boot JAR** containing both the REST API and the Angular frontend as bundled static files.

```
multi-module-project/
├── pom.xml                        ← Parent POM (frontend built before backend)
├── backend/                       ← Spring Boot REST API + final fat JAR
│   └──pom.xml                     ← Depends on frontend JAR (runtime)
├── frontend/                      ← Angular 17 SPA
│   └── pom.xml                    ← Builds Angular → packages into JAR under static/
└── docker/                        ← Docker
    └── Dockerfile                 ← Contains multi-stage instructions 
```

---

## Multiple modules distribution inside executable Jar  

```
mvn clean install
         │
         ├─ [1] frontend module
         │       frontend-maven-plugin: installs Node, runs npm install + ng build
         │       maven-resources-plugin: copies dist/frontend/browser → target/classes/static/
         │       maven-jar-plugin: packages → frontend-1.0.0-SNAPSHOT.jar
         │                          (contains static/index.html, static/*.js, etc.)
         │
         ├─ [2] backend module
                 depends on frontend JAR (runtime scope)
                 spring-boot-maven-plugin repackage:
                  merges all JARs → BOOT-INF/classes/
                  Angular files land at BOOT-INF/classes/static/  ← served by Spring Boot
                output: backend/target/app.jar and docker/dist/app.jar ← (single runnable JAR)
              
```

Thymeleaf and SpaController handles all static (`classpath:/static/`) for Angular routing,  
while UserController handles Restful API calls (`/api/**`).

---
#### Prerequisites
- [nvm](https://github.com/nvm-sh/nvm) node version manager
- Java 17+
- Maven
- Docker
---
## Build & Run

### Run as single JAR

```bash
# From the root
./mvnw clean install

# Run
java -jar backend/target/app.jar
```

Open **http://localhost:8080** → Angular app  
Open **http://localhost:8080/api/users** → REST API  
Open **http://localhost:8080/h2-console** → H2 Console (JDBC URL: `jdbc:h2:mem:testdb`)

---

### Development - build

```bash
# Build Spring Boot backend
./mvnw -pl backend -amd clean install
or
cd backend 
.././mvnw clean

# Build Angular frontend 
npm install --prefix frontend/
or 
cd frontend
npm install 
```

---

### Development — hot reload

```bash
# Terminal 1 — Spring Boot backend
./mvnw -pl backend -amd spring-boot:run
or
cd backend && mvn spring-boot:run

# Terminal 2 — Angular dev server (proxies /api → localhost:8080)
npm run ng serve --prefix frontend/
```

Angular dev server: **http://localhost:4200**

---
### Docker — build and run
```bash
# Runs the build docker image using docker/Dockerfile
docker build -f docker/Dockerfile -t  fullstack-springboot-angular  .

# Runs the docker image 
docker run -p 8080:8080  fullstack-springboot-angular

```

---

## REST API Reference

| Method | Endpoint         | Description    |
|--------|------------------|----------------|
| GET    | /api/users       | List all users |
| GET    | /api/users/{id}  | Get by ID      |
| POST   | /api/users       | Create user    |
| PUT    | /api/users/{id}  | Update user    |
| DELETE | /api/users/{id}  | Delete user    |

**User JSON:**
```json
{ "name": "Zoe", "email": "zoe@pelipas.com", "role": "ADMIN" }
```

---

## Convert H2 to PostgreSQL

`backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=myuser
spring.datasource.password=secret
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=false
```

Add to `backend/pom.xml` dependencies:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```
