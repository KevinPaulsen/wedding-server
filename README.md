# Wedding Web App - README

## Overview
The **Wedding Web App** is a Spring Boot application designed for managing RSVPs, user authentication, and a photo gallery for a wedding. It leverages **AWS DynamoDB** for data storage, **AWS S3** for storing photos, and includes JWT-based security for endpoints.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Key Features](#key-features)
3. [Prerequisites](#prerequisites)
4. [Getting-Started](#getting-started)
5. [Configuration & Environment Variables](#configuration--environment-variables)
6. [Build and Run](#build-and-run)
7. [Testing](#testing)
8. [API Endpoints](#api-endpoints)
    - [Authentication APIs](#authentication-apis)
    - [RSVP APIs](#rsvp-apis)
    - [Gallery APIs](#gallery-apis)
    - [User APIs](#user-apis)
    - [Health Check API](#health-check-api)
9. [Deployment](#deployment)

---

## Project Structure

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── paulsen
│   │           └── wedding
│   │               ├── WeddingWebAppApplication.java        # Main application entry point
│   │               ├── config                               # Spring and AWS configurations
│   │               │   ├── DynamoDBConfig.java
│   │               │   ├── SecurityConfig.java
│   │               │   ├── SecurityConfiguration.java
│   │               │   └── WebConfig.java
│   │               ├── controllers                          # REST controllers
│   │               │   ├── AuthenticationController.java
│   │               │   ├── GalleryController.java
│   │               │   ├── RsvpController.java
│   │               │   └── UserController.java
│   │               ├── exceptions                           # Global exception handling
│   │               │   └── GlobalExceptionHandler.java
│   │               ├── model                               # Entity/model classes (includes RSVP-related classes)
│   │               │   ├── AvailableRsvpCode.java
│   │               │   ├── ChangeImageOrderDto.java
│   │               │   ├── ImageDeleteDto.java
│   │               │   ├── ImageMetadata.java
│   │               │   ├── ImageMetadataDto.java
│   │               │   ├── ImageMetadataKey.java
│   │               │   ├── User.java
│   │               │   └── rsvp
│   │               │       ├── AddRsvpDto.java
│   │               │       ├── DietaryRestriction.java
│   │               │       ├── FoodOption.java
│   │               │       ├── GuestInfo.java
│   │               │       ├── GuestInfoConverter.java
│   │               │       ├── PutRsvpDto.java
│   │               │       ├── Rsvp.java
│   │               │       ├── RsvpGuestDetails.java
│   │               │       ├── RsvpGuestDetailsConverter.java
│   │               │       └── RsvpStatus.java
│   │               ├── repositories                         # Data access objects for DynamoDB
│   │               │   ├── AvailableRsvpCodeRepository.java
│   │               │   ├── ImageMetadataRepository.java
│   │               │   ├── RsvpRepository.java
│   │               │   └── UserRepository.java
│   │               ├── responses                            # Custom response objects
│   │               │   └── LoginResponse.java
│   │               ├── security                             # JWT filters and DTOs
│   │               │   ├── JwtAuthenticationFilter.java
│   │               │   ├── LoginUserDto.java
│   │               │   └── RegisterUserDto.java
│   │               ├── service                              # Business logic services
│   │               │   ├── AuthenticationService.java
│   │               │   ├── GalleryMetadataService.java
│   │               │   ├── JwtService.java
│   │               │   ├── RsvpService.java
│   │               │   ├── S3Service.java
│   │               │   └── UserService.java
│   │               └── util                                 # Utility classes (if any)
│   └── resources
│       ├── application-dev.properties
│       ├── application-prod.properties
│       ├── application.properties
│       ├── static
│       │   ├── css
│       │   │   └── styles.css
│       │   └── js
│       │       └── scripts.js
│       └── templates
│           ├── about.html
│           ├── contact.html
│           ├── index.html
│           ├── index1.html
│           ├── login.html
│           ├── rsvp.html
│           └── success.html
└── test
    └── java
        └── com
            └── paulsen
                └── wedding
                    ├── WeddingWebAppApplicationTests.java   # Sample test class
                    ├── config
                    └── controllers
                        ├── AuthenticationControllerTest.java
                        └── RsvpControllerTest.java
```

---

## Key Features
1. **User Authentication**: User registration and login with **JWT**.
2. **RSVP Management**: Create, update, and delete RSVPs.
3. **Photo Gallery**: Upload images to **AWS S3** and manage metadata in **AWS DynamoDB**.
4. **Global Exception Handling**: Centralized error responses for cleaner code.
5. **Security**:
    - JWT-based filtering using Spring Security.
    - Configured CORS policies for specified domains.
6. **DynamoDB Repositories**: For persisting user, RSVP, and image metadata details.

---

## Prerequisites
- **Java 17** (or compatible version)
- **Gradle** (if you want to use `gradlew`, you don’t need a separate Gradle installation)
- **AWS Credentials**: Make sure your AWS credentials are properly configured (usually in `~/.aws/credentials`) for DynamoDB and S3 operations.
- **(Optional) Docker** if you plan to containerize and run via Docker.

---

## Getting Started
1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/wedding-web-app.git
   cd wedding-web-app
   ```
2. **Configure Environment Variables**  
   You can export them in your shell or use a `.env` file approach:
   ```bash
   export SECURITY_JWT_SECRET_KEY="replace_with_strong_secret"
   export SECURITY_JWT_EXPIRATION_TIME="3600000"  # 1 hour in milliseconds
   ```
   *These are used for generating and validating JWT tokens.*

3. **Install Dependencies & Build**
   ```bash
   ./gradlew build
   ```
   This command will compile the project and download all dependencies.

---

## Configuration & Environment Variables
By default, Spring Boot reads configuration from `application.properties` or from environment variables. Below are key properties:

| Property Name                     | Description                                 | Default / Example           |
|----------------------------------|---------------------------------------------|-----------------------------|
| `server.port`                    | Port on which server will run               | 8080                        |
| `security.jwt.secret-key`        | Secret key for JWT signing                  | **Required** (no default)   |
| `security.jwt.expiration-time`   | JWT token validity duration (in ms)         | 3600000 (1 hour)           |
| `spring.profiles.active`         | Active profile (dev, prod, etc.)            | dev                         |
| `aws.region`                     | AWS region for S3 and DynamoDB              | us-west-2                   |

---

## Build and Run

### Running Locally
1. **Build the Application**
   ```bash
   ./gradlew clean build
   ```
2. **Run via Gradle**
   ```bash
   ./gradlew bootRun
   ```
   or **Run the JAR**:
   ```bash
   java -jar build/libs/wedding-web-app-0.0.1-SNAPSHOT.jar
   ```
3. **Access the Application**:  
   Open your browser (or API client) and go to:
   ```
   http://localhost:8080
   ```

### Docker (Optional)
1. **Create a Dockerfile** (if not already present) with the following snippet:
   ```dockerfile
   FROM openjdk:17-jdk-alpine
   COPY build/libs/*.jar wedding-web-app.jar
   EXPOSE 8080
   ENTRYPOINT ["java","-jar","/wedding-web-app.jar"]
   ```
2. **Build Docker Image**
   ```bash
   docker build -t wedding-web-app .
   ```
3. **Run Container**
   ```bash
   docker run -p 8080:8080 --env SECURITY_JWT_SECRET_KEY=replace_with_strong_secret \
       --env SECURITY_JWT_EXPIRATION_TIME=3600000 \
       wedding-web-app
   ```

---

## Testing
- **Unit Tests & Integration Tests** are located under `src/test/java/com/paulsen/wedding/`.
- **Run Tests**:
  ```bash
  ./gradlew test
  ```
- **Test Examples**:
    - `WeddingWebAppApplicationTests.java` checks if context loads correctly.
    - `RsvpControllerTest.java` and `AuthenticationControllerTest.java` illustrate how to test REST endpoints.

---

## API Endpoints

---

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

> **Note:**
> - `/rsvp/get` and `/rsvp/update` are publicly accessible (no authentication required).
> - All other RSVP endpoints require a valid **Authorization: Bearer <JWT_TOKEN>** header.

<details>
<summary><strong>POST /rsvp/create - Create a new RSVP (Requires Auth)</strong></summary>

**Description:** Creates a new RSVP entry.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

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
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
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
}'
```
</details>

<details>
<summary><strong>PUT /rsvp/edit - Edit RSVP details (Requires Auth)</strong></summary>

**Description:** Edits an existing RSVP entry. Only provided fields will update the RSVP.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

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
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
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
}'
```
</details>

<details>
<summary><strong>PUT /rsvp/update - Update RSVP details (No Auth Required)</strong></summary>

**Description:** Updates an existing RSVP based on RSVP code and matching last name.  
No authentication required.

**Request Body:**
```json
{
  "rsvpCode": "XYZ123",
  "lastName": "Doe",
  "rsvpStatus": "ATTENDING",
  "primaryContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "123-456-7890",
    "address": "123 Main St"
  },
  "rsvpGuestDetails": []
}
```
</details>

<details>
<summary><strong>GET /rsvp/get?rsvpCode={code}&lastname={lastname} - Retrieve RSVP details (No Auth Required)</strong></summary>

**Description:** Retrieves RSVP details based on the RSVP code and matching last name.

**Example API Call:**
```
curl -X GET "http://localhost:8080/rsvp/get?rsvpCode=XYZ123&lastname=Doe"
```
</details>

<details>
<summary><strong>GET /rsvp/all - Retrieve all RSVPs (Requires Auth)</strong></summary>

**Description:** Retrieves all RSVP entries.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example API Call:**
```
curl -X GET http://localhost:8080/rsvp/all \
-H "Authorization: Bearer <JWT_TOKEN>"
```
</details>

<details>
<summary><strong>DELETE /rsvp/delete?rsvpCode={code} - Delete an RSVP (Requires Auth)</strong></summary>

**Description:** Deletes an RSVP entry identified by its RSVP code.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example API Call:**
```
curl -X DELETE "http://localhost:8080/rsvp/delete?rsvpCode=XYZ123" \
-H "Authorization: Bearer <JWT_TOKEN>"
```
</details>

---

### Gallery APIs

> **Note:**
> - `/gallery/all` is publicly accessible (no authentication required).
> - Other gallery endpoints require a valid **Authorization: Bearer <JWT_TOKEN>** header.

<details>
<summary><strong>POST /gallery/generate-presigned-url - Generate S3 upload URL (Requires Auth)</strong></summary>

**Description:** Generates a presigned URL for uploading an image to S3.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileName": "example.jpg"
}
```

**Response:**
```json
{
  "url": "https://example-s3-url",
  "key": "images/example.jpg"
}
```

**Example API Call:**
```
curl -X POST http://localhost:8080/gallery/generate-presigned-url \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"fileName":"example.jpg"}'
```
</details>

<details>
<summary><strong>POST /gallery/metadata - Save image metadata (Requires Auth)</strong></summary>

**Description:** Saves metadata for an uploaded image in DynamoDB.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "imageId": "images/example.jpg",
  "imageUrl": "https://example-s3-url",
  "width": 800,
  "height": 600
}
```

**Response:** Returns the stored `ImageMetadata`.
</details>

<details>
<summary><strong>GET /gallery/all - Get all image metadata (No Auth Required)</strong></summary>

**Description:** Retrieves all image metadata from DynamoDB.

**Example API Call:**
```
curl -X GET http://localhost:8080/gallery/all
```
</details>

<details>
<summary><strong>POST /gallery/change-image-order - Reorder images (Requires Auth)</strong></summary>

**Description:** Adjusts the display order of images.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "movingImageId": "images/example.jpg",
  "previousImageId": "images/anotherImage.jpg",
  "followingImageId": "images/thirdImage.jpg"
}
```
</details>

<details>
<summary><strong>DELETE /gallery/delete - Delete image metadata and file (Requires Auth)</strong></summary>

**Description:** Deletes image metadata from DynamoDB **and** removes the image file from S3.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "imageId": "images/example.jpg"
}
```

**Example API Call:**
```
curl -X DELETE http://localhost:8080/gallery/delete \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"imageId": "images/example.jpg"}'
```
</details>

---

### User APIs

> **Note:** All user endpoints require a valid **Authorization: Bearer <JWT_TOKEN>** header.

<details>
<summary><strong>GET /users/me - Get authenticated user details (Requires Auth)</strong></summary>

**Description:** Retrieves details of the currently authenticated user.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
```

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
-H "Authorization: Bearer <JWT_TOKEN>"
```
</details>

<details>
<summary><strong>GET /users/ - Get all users (Requires Auth)</strong></summary>

**Description:** Retrieves a list of all registered users.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
```

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
curl -X GET http://localhost:8080/users/ \
-H "Authorization: Bearer <JWT_TOKEN>"
```
</details>

<details>
<summary><strong>GET /users/{username} - Get user by username (Requires Auth)</strong></summary>

**Description:** Retrieves details for a specific user by username.

**Headers (Required):**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example API Call:**
```
curl -X GET http://localhost:8080/users/john_doe \
-H "Authorization: Bearer <JWT_TOKEN>"
```
</details>

---

### Health Check API

<details>
<summary><strong>GET /actuator/health - Health Check (No Auth Required)</strong></summary>

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

## Deployment
- **AWS Elastic Beanstalk** or **AWS EC2** is commonly used for production deployment.
- You can configure your environment variables (secret key, etc.) via the AWS console or environment configuration.
- Ensure your DynamoDB tables (`wedding_users`, `wedding_rsvps`, `WeddingGalleryMetadata`, `available_rsvp_codes`) exist and are properly configured.

**Typical Deployment Steps**:
1. Build the project to generate a jar:
   ```bash
   ./gradlew clean build
   ```
2. Deploy the jar to your hosting environment (e.g., Elastic Beanstalk).
