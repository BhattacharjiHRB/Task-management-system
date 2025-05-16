<?php
session_start();
require_once '../utils/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = isset($data['username']) ? trim($data['username']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}

$query = "SELECT id, username,full_name, password, role FROM users WHERE username = :username";
$stmt = $conn->prepare($query);
$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // If passwords are stored as plain text (not recommended), use direct comparison
    if ($password === $user['password']) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['name'] = $user['full_name'];
        echo json_encode([
            'success' => true,
            'role' => $user['role'],
            'message' => 'Login successful.'
        ]);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No user found with the provided username.']);
    exit;
}
?>


