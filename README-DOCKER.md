# PCart - E-commerce Application with Docker

This guide explains how to run the PCart application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Getting Started

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone <repository-url>
   cd Pcart
   ```

2. **Set up environment variables**
   - Copy the example environment file:
     ```bash
     cp server/.env.example server/.env
     ```
   - Update the `.env` file with your configuration

3. **Build and start the application**
   Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Node.js server and React client
   - Start MongoDB, the Node.js server, and the React client
   - Set up the necessary networking between containers

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: Running on port 27017 (only accessible from within the Docker network)

## Stopping the Application

To stop all containers:
```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:
```bash
docker-compose down -v
```

## Development Workflow

- The Node.js server will automatically restart when you make changes to the code (thanks to nodemon in development mode)
- The React development server supports hot-reloading

## Environment Variables

See `server/.env.example` for a list of required environment variables.

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000, 5000, and 27017 are not in use by other applications.
2. **Build issues**: If you encounter build issues, try running `docker-compose build --no-cache` to rebuild the images from scratch.
3. **Database connection**: Ensure the MongoDB connection string in your `.env` file matches the credentials in the `docker-compose.yml` file.

## Production Deployment

For production deployment, consider:
1. Using environment-specific configuration files
2. Setting up proper SSL/TLS certificates
3. Implementing proper security measures (CORS, rate limiting, etc.)
4. Using a managed MongoDB service or properly securing your MongoDB instance

## License

This project is licensed under the terms of the MIT license.
