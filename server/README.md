# Freelance Service Marketplace - Backend Server

## Project Structure

```
server/
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   └── constants.js    # Constants and config values
├── controllers/        # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── projectController.js
│   ├── proposalController.js
│   └── reviewController.js
├── middleware/         # Express middleware
│   ├── auth.js        # JWT authentication
│   └── validation.js  # Input validation
├── models/            # Database schemas
│   ├── User.js
│   ├── Project.js
│   ├── Proposal.js
│   └── Review.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── proposalRoutes.js
│   └── reviewRoutes.js
├── .env.example       # Environment variables template
├── package.json       # Dependencies
└── server.js         # Main server entry point
```

## Getting Started

1. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev     # Development with nodemon
   npm start       # Production
   ```

## API Endpoints (To be implemented)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/freelancers` - Get all freelancers
- `GET /api/users/search` - Search users

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Proposals
- `POST /api/proposals` - Create new proposal
- `GET /api/proposals/project/:projectId` - Get proposals for project
- `PUT /api/proposals/:id/accept` - Accept proposal
- `PUT /api/proposals/:id/reject` - Reject proposal

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews/user/:userId` - Get reviews for user
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **validator** - Data validation
- **express-validator** - Express validation middleware
- **multer** - File upload handling

## Notes

- All TODO comments indicate where implementation is needed
- Use bcryptjs to hash passwords before storing
- Use JWT for authentication
- Always validate and sanitize user input
- Use async/await for database operations
