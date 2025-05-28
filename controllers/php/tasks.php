<?php
include '../../models/tasks.model.php';

header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $required = ['name', 'description', 'due_date', 'priority', 'label', 'category','assigned_to'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $name = htmlspecialchars(trim($_POST['name']));
    $description = htmlspecialchars(trim($_POST['description']));
    $due_date = htmlspecialchars(trim($_POST['due_date']));
    $priority = htmlspecialchars(trim($_POST['priority']));
    $label = htmlspecialchars(trim($_POST['label']));
    $category = htmlspecialchars(trim($_POST['category']));
    $subtasks = isset($_POST['subtasks']) ? array_map('htmlspecialchars', array_map('trim', $_POST['subtasks'])) : [];
    $assigned_to = htmlspecialchars(trim($_POST['assigned_to']));


    $task = [
        'name' => $name,
        'description' => $description,
        'due_date' => $due_date,
        'priority' => $priority,
        'label' => $label,
        'category' => $category,
        'assigned_to' => $assigned_to,
        'subtasks' => $subtasks
    ];

   

   $stmt = createTask($task);

  
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Task created successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create task.']);
        }
        $stmt->close();
    
    
    exit;
}


if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tasks = getTasks();
    if ($tasks) {
        echo json_encode(['success' => true, 'tasks' => $tasks]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No tasks found.']);
    }
    exit;
}

if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    if (isset($data['task_id'])) {
        $taskId = intval($data['task_id']);
        if (deleteTask($taskId)) {
            echo json_encode(['success' => true, 'message' => 'Task deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete task.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Task ID is required.']);
    }
    exit;
}


?>