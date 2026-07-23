<?php
/**
 * Railway Application System - Backend API (XAMPP Compatible)
 * Standard XAMPP MySQL setup: Host: localhost, User: root, Password: ''
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'railform';

try {
    // 1. Initial connection without database to ensure DB exists
    $pdoInit = new PDO("mysql:host=$host", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Create database if not exists
    $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    
    // 2. Connect to actual database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // Create applications table if not exists
    $tableSql = "CREATE TABLE IF NOT EXISTS `applications` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($tableSql);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database Connection Failed: ' . $e->getMessage() . '. Make sure Apache & MySQL are running in XAMPP Control Panel.'
    ]);
    exit();
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Read JSON input if sent via fetch POST with application/json
$rawInput = file_get_contents('php://input');
if ($rawInput) {
    $jsonData = json_decode($rawInput, true);
    if (is_array($jsonData)) {
        $_POST = array_merge($_POST, $jsonData);
        if (empty($action) && isset($_POST['action'])) {
            $action = $_POST['action'];
        }
    }
}

switch ($action) {
    case 'check_db':
        echo json_encode([
            'success' => true,
            'message' => 'Connected to MySQL Database (railway_db) successfully!',
            'db_name' => $dbname
        ]);
        break;

    case 'submit':
        handleSubmitApplication($pdo);
        break;

    case 'track':
        handleTrackApplication($pdo);
        break;

    case 'list':
        handleListApplications($pdo);
        break;

    default:
        echo json_encode([
            'success' => true,
            'status' => 'online',
            'message' => 'Railway Concession & Pass Application Backend API is active.'
        ]);
        break;
}

function handleSubmitApplication($pdo) {
    $fullName    = trim($_POST['full_name'] ?? '');
    $dob         = trim($_POST['dob'] ?? '');
    $gender      = trim($_POST['gender'] ?? '');
    $mobile      = trim($_POST['mobile'] ?? '');
    $email       = trim($_POST['email'] ?? '');
    $idType      = trim($_POST['id_proof_type'] ?? '');
    $idNo        = trim($_POST['id_proof_no'] ?? '');
    $institution = trim($_POST['institution'] ?? '');
    $rollNo      = trim($_POST['roll_no'] ?? '');
    $course      = trim($_POST['course'] ?? '');
    $passType    = trim($_POST['pass_type'] ?? '');
    $fromStation = trim($_POST['from_station'] ?? '');
    $toStation   = trim($_POST['to_station'] ?? '');
    $travelClass = trim($_POST['travel_class'] ?? '');
    $duration    = trim($_POST['duration'] ?? '');
    $fareAmount  = floatval($_POST['fare_amount'] ?? 0);

    // Validation
    if (empty($fullName) || empty($dob) || empty($mobile) || empty($email) || empty($fromStation) || empty($toStation)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        return;
    }

    // Generate unique Application Number e.g., RLY-2026-8A3F9
    $appNo = 'RLY-' . date('Y') . '-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));

    try {
        $stmt = $pdo->prepare("INSERT INTO `applications` 
            (`application_no`, `full_name`, `dob`, `gender`, `mobile`, `email`, `id_proof_type`, `id_proof_no`, `institution`, `roll_no`, `course`, `pass_type`, `from_station`, `to_station`, `travel_class`, `duration`, `fare_amount`, `status`) 
            VALUES (:app_no, :full_name, :dob, :gender, :mobile, :email, :id_type, :id_no, :institution, :roll_no, :course, :pass_type, :from_station, :to_station, :travel_class, :duration, :fare_amount, 'Under Review')");

        $stmt->execute([
            ':app_no'      => $appNo,
            ':full_name'   => $fullName,
            ':dob'         => $dob,
            ':gender'      => $gender,
            ':mobile'      => $mobile,
            ':email'       => $email,
            ':id_type'     => $idType,
            ':id_no'       => $idNo,
            ':institution' => $institution,
            ':roll_no'     => $rollNo,
            ':course'      => $course,
            ':pass_type'   => $passType,
            ':from_station'=> $fromStation,
            ':to_station'  => $toStation,
            ':travel_class'=> $travelClass,
            ':duration'    => $duration,
            ':fare_amount' => $fareAmount
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Application submitted successfully!',
            'application_no' => $appNo,
            'data' => [
                'application_no' => $appNo,
                'full_name'      => $fullName,
                'pass_type'      => $passType,
                'from_station'   => $fromStation,
                'to_station'     => $toStation,
                'travel_class'   => $travelClass,
                'duration'       => $duration,
                'fare_amount'    => $fareAmount,
                'status'         => 'Under Review',
                'created_at'     => date('Y-m-d H:i:s')
            ]
        ]);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to save application: ' . $e->getMessage()]);
    }
}

function handleTrackApplication($pdo) {
    $query = trim($_GET['query'] ?? $_POST['query'] ?? '');

    if (empty($query)) {
        echo json_encode(['success' => false, 'message' => 'Please provide an Application Reference Number, Email, or ID Number.']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM `applications` WHERE `application_no` = :q OR `email` = :q OR `id_proof_no` = :q ORDER BY `id` DESC LIMIT 1");
        $stmt->execute([':q' => $query]);
        $app = $stmt->fetch();

        if ($app) {
            echo json_encode([
                'success' => true,
                'application' => $app
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No application found matching "' . htmlspecialchars($query) . '". Please check your details.'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database query error: ' . $e->getMessage()]);
    }
}

function handleListApplications($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `applications` ORDER BY `id` DESC LIMIT 50");
        $applications = $stmt->fetchAll();

        // Get total count
        $countStmt = $pdo->query("SELECT COUNT(*) AS total FROM `applications`");
        $total = $countStmt->fetch()['total'];

        echo json_encode([
            'success' => true,
            'total' => $total,
            'applications' => $applications
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database query error: ' . $e->getMessage()]);
    }
}
