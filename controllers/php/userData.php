<?php
session_start();
header('Content-Type: application/json');

require_once '../utils/database.php'; // Ensure this file initializes a MySQLi connection in `$conn`

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $required = ['full_name', 'username', 'password', 'role'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $full_name = $_POST['full_name'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];
    $profile_image = null;

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
    $stmt = $conn->prepare("INSERT INTO users (full_name, username, password, role, profile_image) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $full_name, $username, $password, $role, $profile_image);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $fields = [];
    $params = [];

    // Update full_name
    if (isset($_POST['full_name'])) {
        $fields[] = 'full_name = ?';
        $params[] = $_POST['full_name'];
    }

    // Update username
    if (isset($_POST['username'])) {
        $fields[] = 'username = ?';
        $params[] = $_POST['username'];
    }

    // Update role (optional)
    if (isset($_POST['role'])) {
        $fields[] = 'role = ?';
        $params[] = $_POST['role'];
    }

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = dirname(__DIR__, 2) . '/controllers/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $originalName = basename($_FILES['avatar']['name']);
        $projectPath = '/Task-management-system';
        $sanitized = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $originalName);
        $filename = uniqid() . '_' . $sanitized;
        $targetFile = $uploadDir . $filename;
        $relativePath = $projectPath . '/controllers/uploads/' . $filename;

        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
            $fields[] = 'profile_image = ?';
            $params[] = $relativePath;
        } else {
            echo json_encode(['success' => false, 'message' => 'File upload failed.']);
            exit;
        }
    }

    if (count($fields) > 0) {
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $params[] = $user_id;
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(str_repeat('s', count($fields)) . 'i', ...$params);

        if ($stmt->execute()) {
            // Fetch and return updated user data
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->bind_param('i', $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();

            echo json_encode([
                'success' => true,
                'user' => $user
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update user data.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No data to update.']);
    }
    exit;
}

// GET method: fetch user data
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'User not found.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in.'
    ]);
}
?>
