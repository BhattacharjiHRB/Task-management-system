<?php 

include '../../controllers/utils/database.php';

header('Content-Type: application/json');



function createTask($task) {
    global $conn;

    $sql = "INSERT INTO tasks (name, description, due_date, priority, label, category, assigned_to) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        return false;
    }

    // Fix: add the type string and pass variables by reference
    $stmt->bind_param(
        'ssssssi', // 6 strings and 1 integer (assigned_to)
        $task['name'],
        $task['description'],
        $task['due_date'],
        $task['priority'],
        $task['label'],
        $task['category'],
        $task['assigned_to']
    );

    // Execute the main task insert
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Failed to create task: ' . $stmt->error]);
        return false;
    }

    $taskId = $conn->insert_id;

    // Handle subtasks if provided
    if (!empty($task['subtasks']) && is_array($task['subtasks'])) {
        $sqlSubtask = "INSERT INTO subtask (task_id, subtusk_text, is_completed) VALUES (?, ?, ?)";
        $stmtSubtask = $conn->prepare($sqlSubtask);

        if (!$stmtSubtask) {
            echo json_encode(['success' => false, 'message' => 'Subtask prepare failed: ' . $conn->error]);
            return false;
        }

        foreach ($task['subtasks'] as $subtaskText) {
            $isCompleted = 0; // Use 0 for false
            $stmtSubtask->bind_param('isi', $taskId, $subtaskText, $isCompleted);
            $stmtSubtask->execute();
        }

        $stmtSubtask->close();
    }

    return $stmt;
}

function getTasks() {
    global $conn;
    $sql = "SELECT * FROM tasks";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        return [];
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $tasks = [];

    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    return $tasks;
}

function deleteTask($taskId) {
    global $conn;
    $sql = "DELETE FROM tasks WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        return false;
    }

    $stmt->bind_param('i', $taskId);
    if ($stmt->execute()) {
        return true;
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete task: ' . $stmt->error]);
        return false;
    }
}


?>