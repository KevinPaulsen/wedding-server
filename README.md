Wedding Web App - API Documentation

# Overview
This project is a wedding web application that includes user authentication, RSVP management, and security features. It uses Spring Boot with AWS DynamoDB as the database.

---

# Project Structure
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

---

# Prerequisites
### Required Software:
- Java 17
- Gradle
- Docker (optional, for containerized deployment)
- AWS credentials (for DynamoDB integration)

### Setup Instructions:
1. Clone the repository:
   ```
   git clone https://github.com/your-repo.git
   cd wedding-web-app
   ```
2. Configure environment variables:
   ```
   export SECURITY_JWT_SECRET_KEY=your_secret_key
   export SECURITY_JWT_EXPIRATION_TIME=3600000
   ```
3. Install dependencies:
   ```
   ./gradlew build
   ```

---

## API Endpoints

### Authentication APIs

<details>
<summary><strong>POST /auth/signup - Register a new user</strong></summary>

**Description:** Registers a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "user-123",
  "username": "john_doe",
  "password": "$2a$10$encryptedpassword"
}
```

**Example API Call:**
```
curl -X POST http://localhost:8080/auth/signup \
-H "Content-Type: application/json" \
-d '{"username":"john_doe","password":"securepassword"}'
```
</details>

<details>
<summary><strong>POST /auth/login - Authenticate and receive JWT token</strong></summary>

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-string",
  "expiresIn": 3600000
}
```

**Example API Call:**
```
curl -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"john_doe","password":"securepassword"}'
```
</details>

<details>
<summary><strong>POST /auth/verify-token - Verify JWT token validity</strong></summary>

**Description:** Verifies the validity of a JWT token.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
true
```

**Example API Call:**
```
curl -X POST http://localhost:8080/auth/verify-token \
-H "Authorization: Bearer jwt-token-string"
```
</details>

---

### RSVP APIs

<details>
<summary><strong>POST /rsvp/create - Create a new RSVP</strong></summary>

**Description:** Creates a new RSVP entry.

**Request Body:**
```json
{
  "rsvpCode": "XYZ123",
  "rsvpStatus": "ATTENDING",
  "primaryContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "123-456-7890",
    "address": "123 Main St"
  },
  "lastnames": ["Doe"],
  "allowedGuestCount": 2,
  "rsvpGuestDetails": [
    {
      "name": "Jane Doe",
      "foodOption": "VEGGIE",
      "dietaryRestrictions": ["VEGAN"],
      "other": ""
    }
  ]
}
```

**Example API Call:**
```
curl -X POST http://localhost:8080/rsvp/create \
-H "Content-Type: application/json" \
-d '{
  "rsvpCode": "XYZ123",
  "rsvpStatus": "ATTENDING",
  "primaryContact": {"name": "John Doe", "email": "john@example.com", "phoneNumber": "123-456-7890", "address": "123 Main St"},
  "lastnames": ["Doe"],
  "allowedGuestCount": 2,
  "rsvpGuestDetails": [{"name": "Jane Doe", "foodOption": "VEGGIE", "dietaryRestrictions": ["VEGAN"], "other": ""}]
}'
```
</details>

<details>
<summary><strong>PUT /rsvp/edit - Edit RSVP details</strong></summary>

**Description:** Edits an existing RSVP entry.

**Request Body:** (Similar to /rsvp/create; only provided fields will update the RSVP)
```json
{
  "rsvpCode": "XYZ123",
  "rsvpStatus": "ATTENDING",
  "primaryContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "123-456-7890",
    "address": "123 Main St"
  },
  "lastnames": ["Doe"],
  "allowedGuestCount": 3,
  "rsvpGuestDetails": [
    {
      "name": "Jane Doe",
      "foodOption": "VEGGIE",
      "dietaryRestrictions": ["VEGAN"],
      "other": "Gluten-free"
    }
  ]
}
```

**Example API Call:**
```
curl -X PUT http://localhost:8080/rsvp/edit \
-H "Content-Type: application/json" \
-d '{
  "rsvpCode": "XYZ123",
  "rsvpStatus": "ATTENDING",
  "primaryContact": {"name": "John Doe", "email": "john@example.com", "phoneNumber": "123-456-7890", "address": "123 Main St"},
  "lastnames": ["Doe"],
  "allowedGuestCount": 3,
  "rsvpGuestDetails": [{"name": "Jane Doe", "foodOption": "VEGGIE", "dietaryRestrictions": ["VEGAN"], "other": "Gluten-free"}]
}'
```
</details>

<details>
<summary><strong>DELETE /rsvp/delete?rsvpCode={code} - Delete an RSVP</strong></summary>

**Description:** Deletes an RSVP entry identified by its RSVP code.

**Example API Call:**
```
curl -X DELETE "http://localhost:8080/rsvp/delete?rsvpCode=XYZ123"
```
</details>

<details>
<summary><strong>GET /rsvp/get?rsvpCode={code}&lastname={lastname} - Retrieve RSVP details</strong></summary>

**Description:** Retrieves RSVP details based on the RSVP code and matching last name.

**Example API Call:**
```
curl -X GET "http://localhost:8080/rsvp/get?rsvpCode=XYZ123&lastname=Doe"
```
</details>

---

### User APIs

<details>
<summary><strong>GET /users/me - Get authenticated user details</strong></summary>

**Description:** Retrieves details of the currently authenticated user.

**Response:**
```json
{
  "id": "user-123",
  "username": "john_doe"
}
```

**Example API Call:**
```
curl -X GET http://localhost:8080/users/me \
-H "Authorization: Bearer jwt-token-string"
```
</details>

<details>
<summary><strong>GET /users/ - Get all users</strong></summary>

**Description:** Retrieves a list of all registered users.

**Response:**
```json
[
  {
    "id": "user-123",
    "username": "john_doe"
  },
  {
    "id": "user-456",
    "username": "jane_doe"
  }
]
```

**Example API Call:**
```
curl -X GET http://localhost:8080/users/
```
</details>

<details>
<summary><strong>GET /users/{username} - Get user by username</strong></summary>

**Description:** Retrieves details for a specific user by username.

**Example API Call:**
```
curl -X GET http://localhost:8080/users/john_doe
```
</details>

---

### Health Check API

<details>
<summary><strong>GET /actuator/health - Health Check</strong></summary>

**Description:** Returns the health status of the application.

**Response:**
```json
{
  "status": "UP"
}
```

**Example API Call:**
```
curl -X GET http://localhost:8080/actuator/health
```
</details>

---

# Build, Run, and Test Locally

### Running the Application Locally
1. **Build the application**
   ```
   ./gradlew clean build
   ```
2. **Run the application**
   ```
   ./gradlew bootRun
   ```
   or
   ```
   java -jar build/libs/wedding-web-app-0.0.1-SNAPSHOT.jar
   ```

### Accessing the Local Server
- Once the application is running, it will be available at:
  ```
  http://localhost:8080
  ```
- Example: Access the health check endpoint:
  ```
  http://localhost:8080/actuator/health
  ```

### Testing API Locally
1. **Use cURL commands (examples provided above).**
2. **Use Postman or another API client.**
    - Set `http://localhost:8080` as the base URL.
    - Add the appropriate request method, headers, and body.

3. **Check logs while testing:**
   ```
   tail -f logs/application.log
   ```
   This will help debug issues during testing.

---

# Deployment
- Uses AWS Elastic Beanstalk.
- The build artifacts are stored in `build/libs/`.
- To deploy:
  ```
  eb deploy
  ```

---

# Environment Variables
```
security.jwt.secret-key=your_secret_key
security.jwt.expiration-time=3600000
```

This documentation provides all the details needed to understand and test the APIs.