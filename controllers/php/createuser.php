<?php 

require_once '../utils/database.php';

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $required = ['full_name', 'username', 'password', 'role'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $full_name = $_POST['full_name'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $profile_image = $_POST['profile_image'] ?? null;

    // Handle optional profile_image upload
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = dirname(__DIR__, 2) . '/controllers/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $originalName = basename($_FILES['profile_image']['name']);
        $projectPath = '/Task-management-system';
        $sanitized = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $originalName);
        $filename = uniqid() . '_' . $sanitized;
        $targetFile = $uploadDir . $filename;
        $relativePath = $projectPath . '/controllers/uploads/' . $filename;

        if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $targetFile)) {
            $profile_image = $relativePath;
        } else {
            echo json_encode(['success' => false, 'message' => 'Profile image upload failed.']);
            exit;
        }
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already taken.']);
        exit;
    }

    // Insert user with optional profile_image
    $sql = "INSERT INTO users (full_name, username, password, role, profile_image) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssss', $full_name, $username, $password, $role, $profile_image);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed.']);
    }
    exit;
}

include '../../models/user.model.php';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $users = getEmployees($conn);

    echo json_encode(['success' => true, 'employees' => $users]);
    exit;
}


if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    if (isset($data['userId'])) {
        $userId = $data['userId'];
        if (deleteUser($conn, $userId)) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    }
    exit;
}



?>


?>