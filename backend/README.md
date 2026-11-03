# WineNotebook Backend (Java 21 & Spring Boot 3.3)

A modern, clean, production-ready REST API for the **WineNotebook** application, built using **Java 21 LTS** and **Spring Boot 3.3.5**.

---

## 🌟 Why Java 21 & Spring Boot 3?

1. **Dramatic Boilerplate Reduction with Records**:
   - Outgoing and incoming payloads (`WineRequest`, `WineResponse`) are implemented as native **Java 21 Records**.
   - Eliminates 100% of verbose constructors, getters, setters, `equals()`, `hashCode()`, and `toString()` methods.
2. **Modern Jakarta Persistence (JPA)**:
   - Migration from deprecated `javax.*` packages to modern `jakarta.persistence.*`.
3. **Immutability & Thread Safety**:
   - Record DTOs are inherently immutable and safe for concurrent multi-threaded execution.
4. **Spring Boot 3.3 Optimization**:
   - Fast startup time, unified configuration, and first-class Java 21 support.

---

## 🏛️ SOLID Principles Architecture

| Principle | Implementation in WineNotebook |
| :--- | :--- |
| **S - Single Responsibility** | - `WineController`: HTTP routing, status codes, and input validation.<br>- `WineServiceImpl`: Business domain logic and transaction boundaries.<br>- `WineRepository`: Data access and persistence queries.<br>- `WineMapper`: Dedicated entity $\leftrightarrow$ DTO conversions.<br>- `GlobalExceptionHandler`: Centralized error handling and status mapping. |
| **O - Open / Closed** | - Domain operations are defined via the `WineService` interface. New features (e.g., wine recommendation engine, CSV exporter) can implement or extend contracts without modifying existing controllers. |
| **L - Liskov Substitution** | - `WineServiceImpl` strictly satisfies the behavioral contracts defined by `WineService`. Any alternative implementation (e.g., `CachedWineService` or `MongoWineService`) can be substituted transparently. |
| **I - Interface Segregation** | - `WineService` provides a cohesive interface tailored specifically to wine cellar domain operations, avoiding bloated generic god-interfaces. |
| **D - Dependency Inversion** | - High-level modules (`WineController`) depend on the abstraction (`WineService`), not on concrete implementations.<br>- Dependencies are injected via clean constructor injection. |

---

## 🚀 Running Locally

### Prerequisites
- JDK 21+
- Maven 3.9+ (or Maven Wrapper)

### Quick Start (Dev Profile with In-Memory H2 DB)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
The application will boot on **port 8080**:
- API: `http://localhost:8080/wine/all`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:winedb`, User: `sa`, Password: blank)

### Production Mode with MySQL
```bash
export DATABASE_URL="jdbc:mysql://your-db-host:3306/winedb"
export DATABASE_USERNAME="chasbott182"
export DATABASE_PASSWORD="your-password"

mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Docker
```bash
cd backend
docker build -t winenotebook-backend .
docker run -p 8080:8080 winenotebook-backend
```

---

## 📡 REST API Endpoints

- `GET /wine/all`: Retrieve all wine entries
- `GET /wine/find/{id}`: Retrieve wine by ID
- `POST /wine/add`: Add new wine (JSON body validated against `WineRequest`)
- `PUT /wine/update`: Update wine (JSON body with `id`)
- `DELETE /wine/delete/{id}`: Delete wine by ID
- `GET /wine/brand/{brand}`: Filter by winery/brand
- `GET /wine/varietal/{varietal}`: Filter by grape varietal
