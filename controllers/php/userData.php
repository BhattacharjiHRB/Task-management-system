<?php
session_start();
header('Content-Type: controllerslication/json');

require_once '../utils/database.php';



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
        $fields[] = 'full_name = :full_name';
        $params[':full_name'] = $_POST['full_name'];
    }

    // Update username
    if (isset($_POST['username'])) {
        $fields[] = 'username = :username';
        $params[':username'] = $_POST['username'];
    }

    // Update role (optional)
    if (isset($_POST['role'])) {
        $fields[] = 'role = :role';
        $params[':role'] = $_POST['role'];
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
        $fields[] = 'profile_image = :profile_image';
        $params[':profile_image'] = $relativePath;
    } else {
        echo json_encode(['success' => false, 'message' => 'File upload failed.']);
        exit;
    }
}

    if (count($fields) > 0) {
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $params[':id'] = $user_id;
        $stmt = $conn->prepare($sql);

        if ($stmt->execute($params)) {
            // Fetch and return updated user data
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

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

    $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

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
