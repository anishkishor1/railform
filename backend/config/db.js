const mysql = require('mysql2/promise');

const connectionString = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL;

let pool;

if (connectionString) {
    console.log('Connecting to MySQL using Connection String URI');
    try {
        const url = new URL(connectionString);
        pool = mysql.createPool({
            host: url.hostname,
            port: parseInt(url.port || '3306', 10),
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database: url.pathname.replace(/^\//, '') || 'railform',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            connectTimeout: 10000
        });
    } catch (e) {
        pool = mysql.createPool(connectionString);
    }
} else {
    const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
    const user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || '';
    const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'railform';
    const port = parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10);

    console.log(`Connecting to MySQL at ${host}:${port}, database: ${database}`);

    pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000
    });
}

// Resilient query wrapper with auto-retry on stale connections
const executeQuery = async (sql, params = [], retries = 2) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await pool.query(sql, params);
        } catch (err) {
            console.error(`DB Query Attempt ${attempt} failed: ${err.message}`);
            if (attempt === retries || !['PROTOCOL_CONNECTION_LOST', 'ECONNRESET', 'ETIMEDOUT', 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'].includes(err.code)) {
                throw err;
            }
            await new Promise(r => setTimeout(r, 500));
        }
    }
};

async function initDB() {
    try {
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
        await executeQuery(tableSql);
        console.log('Database connected and applications table initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database table:', error.message);
    }
}

initDB();

module.exports = {
    query: (sql, params) => executeQuery(sql, params),
    pool
};
