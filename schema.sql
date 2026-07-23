-- Indian Railways Application Database Schema for XAMPP MySQL
-- Database: `railform`

CREATE DATABASE IF NOT EXISTS `railform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `railform`;

-- Applications Table
CREATE TABLE IF NOT EXISTS `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_no` VARCHAR(30) NOT NULL UNIQUE,
    `full_name` VARCHAR(100) NOT NULL,
    `dob` DATE NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `mobile` VARCHAR(15) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `id_proof_type` VARCHAR(50) NOT NULL,
    `id_proof_no` VARCHAR(50) NOT NULL,
    `institution` VARCHAR(150) NOT NULL,
    `roll_no` VARCHAR(50) NOT NULL,
    `course` VARCHAR(100) NOT NULL,
    `pass_type` VARCHAR(50) NOT NULL,
    `from_station` VARCHAR(100) NOT NULL,
    `to_station` VARCHAR(100) NOT NULL,
    `travel_class` VARCHAR(20) NOT NULL,
    `duration` VARCHAR(30) NOT NULL,
    `fare_amount` DECIMAL(10,2) DEFAULT 0.00,
    `status` VARCHAR(30) DEFAULT 'Under Review',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Initial Data (Optional)
INSERT INTO `applications` 
(`application_no`, `full_name`, `dob`, `gender`, `mobile`, `email`, `id_proof_type`, `id_proof_no`, `institution`, `roll_no`, `course`, `pass_type`, `from_station`, `to_station`, `travel_class`, `duration`, `fare_amount`, `status`) 
VALUES 
('RLY-2026-DEMO01', 'Kishore Kumar', '2003-05-15', 'Male', '9876543210', 'kishore@example.com', 'Aadhaar Card', '1234-5678-9012', 'Government Engineering College', '2026-CS-042', 'B.Tech CS', 'Student Concession (50%)', 'Chennai Central (MAS)', 'Tambaram (TBM)', 'Second Class (2S)', '1 Month', 300.00, 'Under Review');
