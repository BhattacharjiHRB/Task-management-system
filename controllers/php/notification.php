<?php
include_once '../utils/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT * FROM notifications ORDER BY created_at DESC";
        $result = $db->query($query);

        if ($result) {
            $notifications = [];
            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }

            echo json_encode([
                'success' => true,
                'data' => $notifications
            ]);
        } else {
            throw new Exception("Query failed: " . $db->error);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch notifications',
            'error' => $e->getMessage()
        ]);
    }
}
?>
