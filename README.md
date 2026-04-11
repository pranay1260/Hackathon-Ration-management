# Ration Distribution System (Backend)

## Overview

This project is a backend system for managing ration distribution.
It is designed to help authorities manage users, ration cards, inventory, allocation of items, and distribution process.

The system follows a proper workflow so that ration is distributed only when all required conditions are satisfied.
---
## Features
* Create and manage users
* Issue ration cards (one card per user)
* Add and manage ration items
* Maintain inventory stock
* Allocate items to users
* Distribute ration with validation checks
* Track transaction status (INITIATED, SUCCESS, FAILED)
---
## Tech Stack
* Java
* Spring Boot
* Spring Data JPA
* MySQL
---
## Architecture
The project follows a layered architecture:
Controller → Service → Repository → Database
* Controller handles API requests
* Service contains business logic
* Repository interacts with database
* Entity represents database tables

---
## Workflow (Lifecycle)
The distribution process follows a clear flow:
INITIATED → VALIDATION → SUCCESS / FAILED
Steps involved:
* Check if ration card is ACTIVE
* Check allocation availability
* Check requested quantity
* Check inventory stock
* Update inventory
* Set transaction status
---
## API Endpoints
POST /users → Create user
POST /cards → Create ration card
POST /items → Add ration item
POST /inventory → Add inventory
POST /allocations → Allocate ration
POST /distribution → Distribute ration
---
## How to Run

1. Open the project in VS Code or IntelliJ

2. Configure MySQL in `application.properties`

3. Run the project using:

   mvn spring-boot:run

4. Use Postman to test APIs
---
## Notes

* Each user can have only one ration card
* Distribution happens only if all validation checks pass
* Inventory is updated after successful distribution
---
## Author
Pranay Teja
