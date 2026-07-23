const db = require('../config/db');

exports.checkDb = async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({
            success: true,
            message: 'Connected to MySQL Database (railform) successfully!',
            db_name: process.env.DB_NAME || 'railform'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Connection Failed: ' + error.message });
    }
};

exports.submitApplication = async (req, res) => {
    try {
        const {
            full_name, dob, gender, mobile, email, id_proof_type, id_proof_no,
            institution, roll_no, course, pass_type, from_station, to_station,
            travel_class, duration, fare_amount
        } = req.body;

        if (!full_name || !dob || !mobile || !email || !from_station || !to_station) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
        }

        // Generate Application Number: RLY-YYYY-XXXXXX
        const year = new Date().getFullYear();
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const appNo = `RLY-${year}-${randomString}`;

        const fare = parseFloat(fare_amount || 0);

        const sql = `
            INSERT INTO applications 
            (application_no, full_name, dob, gender, mobile, email, id_proof_type, id_proof_no, 
             institution, roll_no, course, pass_type, from_station, to_station, travel_class, duration, fare_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review')
        `;

        await db.query(sql, [
            appNo, full_name, dob, gender, mobile, email, id_proof_type, id_proof_no,
            institution, roll_no, course, pass_type, from_station, to_station,
            travel_class, duration, fare
        ]);

        res.json({
            success: true,
            message: 'Application submitted successfully!',
            application_no: appNo,
            data: {
                application_no: appNo,
                full_name,
                pass_type,
                from_station,
                to_station,
                travel_class,
                duration,
                fare_amount: fare,
                status: 'Under Review',
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save application: ' + error.message });
    }
};

exports.trackApplication = async (req, res) => {
    try {
        const query = req.query.query || req.body.query;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Please provide an Application Reference Number, Email, or ID Number.' });
        }

        const sql = `SELECT * FROM applications WHERE application_no = ? OR email = ? OR id_proof_no = ? ORDER BY id DESC LIMIT 1`;
        const [rows] = await db.query(sql, [query, query, query]);

        if (rows.length > 0) {
            res.json({ success: true, application: rows[0] });
        } else {
            res.json({ success: false, message: `No application found matching "${query}". Please check your details.` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database query error: ' + error.message });
    }
};

exports.listApplications = async (req, res) => {
    try {
        const [applications] = await db.query('SELECT * FROM applications ORDER BY id DESC LIMIT 50');
        const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM applications');

        res.json({
            success: true,
            total,
            applications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database query error: ' + error.message });
    }
};
