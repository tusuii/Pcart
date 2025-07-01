# Admin Panel Setup Guide

This guide will help you set up and use the admin panel for the Pcart e-commerce application.

## Prerequisites

- Node.js and npm installed
- MongoDB database connection string
- The application should be set up and running

## Setting Up Admin User

1. First, make sure your `.env` file in the server directory has the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

2. Run the admin seed script to create an initial admin user:
   ```bash
   cd server
   node seedAdmin.js
   ```
   This will create an admin user with the following credentials:
   - Email: admin@example.com
   - Password: admin123

   **Important:** Change the default password after your first login.

## Accessing the Admin Panel

1. Start the application if it's not already running:
   ```bash
   # In the project root
   cd client && npm start
   # In a new terminal
   cd server && npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/admin/login
   ```

3. Log in using the admin credentials created earlier.

## Admin Panel Features

### Dashboard
- View all products in the system
- See product details including name, price, and stock

### Add New Product
1. Click the "Add Product" button
2. Fill in the product details:
   - Name
   - Description
   - Price
   - Stock quantity
   - Image URL (optional)
3. Click "Add Product" to save

### Edit Product
1. Click the edit (pencil) icon next to the product you want to edit
2. Update the product details
3. Click "Update Product" to save changes

### Delete Product
1. Click the delete (trash) icon next to the product you want to remove
2. Confirm the deletion when prompted

## Security Notes

1. **Change Default Credentials**: After your first login, change the default admin password.
2. **Use Strong Passwords**: Always use strong, unique passwords for admin accounts.
3. **HTTPS**: In production, ensure your admin panel is served over HTTPS.
4. **Rate Limiting**: Consider implementing rate limiting on admin routes in production.
5. **Logging**: Monitor admin login attempts and actions for security purposes.

## Troubleshooting

- **Can't log in to admin panel**:
  - Verify the admin user exists in the database
  - Check server logs for any errors
  - Ensure JWT_SECRET is set correctly in your .env file

- **Products not loading**:
  - Check your MongoDB connection
  - Verify the server is running and accessible
  - Check browser console for any errors

## Support

For additional help, please contact the development team or refer to the project documentation.
