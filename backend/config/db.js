const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    try {
        // Create database if not exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'railform'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await connection.end();

        // Create table if not exists using the pool
        const tableSql = `
            CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                application_no VARCHAR(30) NOT NULL UNIQUE,
                full_name VARCHAR(100) NOT NULL,
                dob DATE NOT NULL,
                gender VARCHAR(20) NOT NULL,
                mobile VARCHAR(15) NOT NULL,
                email VARCHAR(100) NOT NULL,
                id_proof_type VARCHAR(50) NOT NULL,
                id_proof_no VARCHAR(50) NOT NULL,
                institution VARCHAR(150) NOT NULL,
                roll_no VARCHAR(50) NOT NULL,
                course VARCHAR(100) NOT NULL,
                pass_type VARCHAR(50) NOT NULL,
                from_station VARCHAR(100) NOT NULL,
                to_station VARCHAR(100) NOT NULL,
                travel_class VARCHAR(20) NOT NULL,
                duration VARCHAR(30) NOT NULL,
                fare_amount DECIMAL(10,2) DEFAULT 0.00,
                status VARCHAR(30) DEFAULT 'Under Review',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await pool.query(tableSql);
        console.log('Database and applications table initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
}

initDB();

module.exports = pool;
