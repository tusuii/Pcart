const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function initDatabase() {
  try {
    console.log('Waiting for MongoDB to be ready...');
    // Wait for MongoDB to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Seeding admin user...');
    await execAsync('node seedAdmin.js');
    
    console.log('Seeding products...');
    await execAsync('node seedProducts.js');
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
