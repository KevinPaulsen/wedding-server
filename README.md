# Wedding Web App

This is a **Spring Boot** web application for managing wedding-related features such as authentication, RSVPs, and user management. It includes security configurations, JWT-based authentication, and database integration with **DynamoDB**.

## Features
- **Authentication**: User signup, login, and JWT token verification.
- **RSVP Management**: Create, edit, and delete RSVPs.
- **User Management**: Fetch user details and manage user authentication.
- **Security**: Configured with Spring Security and JWT authentication.
- **CORS Support**: Configured to allow frontend access from specific domains.

## Project Structure
```
src/
│── main/
│   ├── java/com/paulsen/wedding/
│   │   ├── controllers/       # REST API Controllers
│   │   │   ├── AuthenticationController.java
│   │   │   ├── RsvpController.java
│   │   │   ├── UserController.java
│   │   ├── config/            # Configuration classes
│   │   │   ├── DynamoDBConfig.java
│   │   │   ├── SecurityConfig.java
│   │   │   ├── SecurityConfiguration.java
│   │   │   ├── WebConfig.java
│   │   ├── model/             # Data models
│   │   ├── service/           # Business logic
│   │   ├── security/          # Security-related classes
│   │   ├── repositories/      # Database repositories
│   │   ├── WeddingWebAppApplication.java  # Main entry point
│── resources/
│   ├── application.properties  # Configuration file
│── Dockerfile                 # Docker container setup
│── build.gradle               # Gradle dependencies and build setup
```

## Getting Started

### Prerequisites
- Java 17+
- Gradle
- AWS Credentials (for DynamoDB)
- Docker (optional)

### Setup
1. Clone the repository:
   ```
   git clone https://github.com/your-repo/wedding-web-app.git
   cd wedding-web-app
   ```

2. Configure your database and security settings in `application.properties`.

3. Build and run the project:
   ```
   ./gradlew bootRun
   ```

4. Run inside a Docker container:
   ```
   docker build -t wedding-web-app .
   docker run -p 8080:8080 wedding-web-app
   ```

### API Endpoints

#### Authentication
- `POST /auth/signup` → Register a new user
- `POST /auth/login` → Authenticate and receive JWT token
- `POST /auth/verify-token` → Verify JWT token validity

#### RSVP
- `POST /rsvp/create` → Create a new RSVP
- `PUT /rsvp/edit` → Edit RSVP details
- `DELETE /rsvp/delete?rsvpCode={code}` → Delete an RSVP
- `GET /rsvp/get?rsvpCode={code}&lastname={lastname}` → Retrieve RSVP details

#### Users
- `GET /users/me` → Get authenticated user details
- `GET /users/` → Get all users
- `GET /users/{username}` → Get user by username

## Security
- Uses **Spring Security** with JWT authentication.
- **CORS configured** to allow requests from:
    - `http://localhost:3000`
    - `https://kevinlovesolivia.com`
    - `https://api.kevinlovesolivia.com`

## Deployment
You can deploy this application to **AWS ECS** or any cloud provider supporting **Docker containers**.

---

© 2025 Kevin Paulsen. All rights reserved.