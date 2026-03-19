# Fullstack Monorepo project - Multi-Module Maven, Frontend(Angular) and Backend (Spring Boot)

A **multi-module Maven project** that produces a **single runnable Spring Boot JAR** containing both the REST API and the Angular frontend as bundled static files.

```
multi-module-project/
├── pom.xml                        ← Parent POM (frontend built before backend)
├── backend/                       ← Spring Boot REST API + final fat JAR
│   └──pom.xml                    ← Depends on frontend JAR (runtime)
└── frontend/                      ← Angular 17 SPA
    └── pom.xml                    ← Builds Angular → packages into JAR under static/

```

---

## How the single-JAR works

```
mvn clean install
         │
         ├─ [1] frontend module
         │       frontend-maven-plugin: installs Node, runs npm install + ng build
         │       maven-resources-plugin: copies dist/frontend/browser → target/classes/static/
         │       maven-jar-plugin: packages → frontend-1.0.0-SNAPSHOT.jar
         │                          (contains static/index.html, static/*.js, etc.)
         │
         └─ [2] backend module
                 depends on frontend JAR (runtime scope)
                 spring-boot-maven-plugin repackage:
                   merges all JARs → BOOT-INF/classes/
                   Angular files land at BOOT-INF/classes/static/  ← served by Spring Boot
                 output: backend/target/app.jar  ← single runnable JAR
```

Spring Boot automatically serves anything under `classpath:/static/`.  
`WebMvcConfig` forwards unknown routes (e.g. `/users`) → `index.html` for Angular's router.

---

## Build & Run

### Production — single JAR

```bash
# From the root
mvn clean install

# Run
java -jar backend/target/app.jar
```

Open **http://localhost:8080** → Angular app  
Open **http://localhost:8080/api/users** → REST API  
Open **http://localhost:8080/h2-console** → H2 Console (JDBC URL: `jdbc:h2:mem:testdb`)

---

### Development — hot reload

```bash
# Terminal 1 — Spring Boot backend
cd backend && mvn spring-boot:run

# Terminal 2 — Angular dev server (proxies /api → localhost:8080)
cd frontend && npm install && npm start
```

Angular dev server: **http://localhost:4200**

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
{ "name": "Alice", "email": "alice@example.com", "role": "ADMIN" }
```

---

## Swap H2 → PostgreSQL

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
