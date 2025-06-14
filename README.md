# AccessNest - Role-Based Ticketing System


*A modern ticketing system with role-based access control*

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Role-Based Access
- **Users**:
  - Create tickets
  - View own tickets
  - Add comments to tickets

- **Agents**:
  - All user permissions
  - View all open tickets
  - Assign/update tickets
  - Change ticket status

- **Admins**:
  - Full system access
  - Manage users/roles
  - Delete any ticket
  - Advanced analytics

### Core Functionality
- Ticket lifecycle management
- Real-time notifications
- Audit logging
- Priority escalation
- Comment threads

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- Axios

### Backend
- Node.js 16+
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Installation

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- Git

### Setup
```bash
# Clone repository
git https://github.com/LEAKONO/Role-Management.git

cd accessnest
```
# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables (see .env.example)
## API Documentation
## API Endpoints

### Authentication

| Endpoint          | Method | Description                     | Request Body Example                          |
|-------------------|--------|---------------------------------|-----------------------------------------------|
| `/auth/register`  | POST   | Register new user               | `{ "username":"test", "email":"test@example.com", "password":"Pass@123", "role":"user" }` |
| `/auth/login`     | POST   | Login existing user             | `{ "email":"test@example.com", "password":"Pass@123" }` |

### Tickets

| Endpoint          | Method | Auth Required       | Description                          | Request Body Example (PUT/POST)              |
|-------------------|--------|---------------------|--------------------------------------|-----------------------------------------------|
| `/tickets`        | GET    | All Roles           | Get tickets (role-filtered)          | -                                             |
| `/tickets`        | POST   | All Roles           | Create new ticket                    | `{ "title":"Bug", "description":"...", "priority":"high" }` |
| `/tickets/:id`    | GET    | Owner/Agent/Admin   | Get single ticket                    | -                                             |
| `/tickets/:id`    | PUT    | Owner/Agent/Admin   | Update ticket                        | `{ "status":"resolved", "comment":"Fixed in v1.2" }` |
| `/tickets/:id`    | DELETE | Owner/Admin         | Delete ticket                        | -                                             |

### Users (Admin Only)

| Endpoint          | Method | Auth Required | Description                          |
|-------------------|--------|---------------|--------------------------------------|
| `/users`          | GET    | Admin         | Get all users                        |
| `/users/:id`      | PUT    | Admin         | Update user role/status              |
| `/users/:id`      | DELETE | Admin         | Delete user                          |



## Contributing
1. Fork the repository

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## License
Distributed under the MIT License. See LICENSE for more information.

## Project Maintainers
**Emmanuel Leakono**
