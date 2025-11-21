# Library Management System

A comprehensive library management system featuring role-based authentication, AI-powered search and recommendations, automated workflows, and analytics.

## Features

### Authentication & User Roles
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt

### Admin Dashboard
- Book management (CRUD operations)
- User management with ban/unban functionality
- Analytics and reporting
- Bulk book import capabilities

### User Dashboard
- Catalog search with advanced filtering
- Personalized book recommendations
- Borrowing history and current loans
- Profile management

### AI-Powered Features
- Intelligent book search using NLP
- Personalized recommendation engine
- AI chatbot for library queries
- Demand forecasting and inventory predictions

### System Features
- Real-time notifications via WebSocket
- Automated fine calculation
- Book reservation system
- Comprehensive transaction tracking

## Technology Stack

### Frontend
- React.js 18 with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- React Router for navigation

### Backend
- Node.js with Express.js
- TypeScript for type safety
- PostgreSQL for relational data
- Redis for caching and sessions
- JWT for authentication

### AI Service
- Python with FastAPI
- spaCy for NLP processing
- Scikit-learn for recommendations
- Elasticsearch for advanced search

### DevOps
- Docker and Docker Compose
- PostgreSQL for database
- Redis for caching
- Nginx for reverse proxy

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Using Docker Compose (Recommended)**
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up -d

   # Run database migrations
   docker-compose -f docker-compose.dev.yml exec backend npm run migrate

   # View logs
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Manual Setup**

   **Backend:**
   ```bash
   cd backend
   npm install
   npm run build
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

   **AI Service:**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE library_management;
   ```

2. **Run migrations**
   ```bash
   cd backend
   npm run migrate
   ```

3. **Seed database (optional)**
   ```bash
   npm run seed
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **API Documentation**: http://localhost:5000/health

## Default Admin Account

After setting up the database, create an admin account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "Admin123!",
    "first_name": "System",
    "last_name": "Administrator",
    "role": "admin"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Books
- `GET /api/books` - Get books with pagination
- `POST /api/books` - Add new book (Admin only)
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Users (Admin only)
- `GET /api/users` - Get users with pagination
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/ban` - Ban user

### AI Services
- `POST /ai/search` - Intelligent book search
- `GET /ai/recommendations/:userId` - Get recommendations
- `POST /ai/chatbot` - Chatbot interaction

## Development

### Project Structure
```
├── frontend/          # React frontend application
├── backend/           # Node.js API server
├── ai-service/        # Python AI microservice
├── shared-types/      # TypeScript type definitions
├── docs/             # Documentation
└── docker/           # Docker configurations
```

### Scripts

**Root level:**
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start all services in development
- `npm run build` - Build all applications
- `npm run test` - Run all tests

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run test` - Run tests
- `npm run migrate` - Run database migrations

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests

### Environment Variables

See `.env.example` for all available environment variables and their descriptions.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### AI Service Tests
```bash
cd ai-service
pytest
```

## Deployment

### Production Docker Setup
```bash
# Build and start production containers
docker-compose up -d

# Scale services if needed
docker-compose up -d --scale backend=3 --scale frontend=2
```

### Manual Production Deployment

1. **Build applications**
   ```bash
   npm run build
   ```

2. **Set up production database**
   - Configure PostgreSQL with proper security
   - Run migrations
   - Set up backups

3. **Configure reverse proxy (Nginx)**
   - Set up SSL certificates
   - Configure load balancing

4. **Set up monitoring**
   - Application performance monitoring
   - Database monitoring
   - Log aggregation

## Security Considerations

- JWT tokens with short expiration and refresh mechanism
- Password hashing with bcrypt (minimum 12 rounds)
- Rate limiting on authentication endpoints
- SQL injection prevention with parameterized queries
- XSS protection with content security policies
- CORS configuration for API access
- Regular security updates and dependency scanning

## Performance Optimization

- Database indexing on frequently queried columns
- Redis caching for frequently accessed data
- Connection pooling for database connections
- CDN integration for static assets
- Lazy loading and code splitting in frontend
- API response pagination and compression

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email/SMS notifications
- [ ] Integration with external book databases
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Book recommendation algorithm improvements
- [ ] Voice search integration