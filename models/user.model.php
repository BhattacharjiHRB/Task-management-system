<?php

include_once '../../controllers/utils/database.php';

function create_user($conn, $data){
    $sql = "INSERT INTO users (username, full_name, password, role, profile_image) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt -> execute($data);
};

function getEmployees($conn) {
    $sql = "SELECT id, username, full_name, role, profile_image FROM users WHERE role = 'employee'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
    return $employees;
}


// function deleteUser($conn, $userId) {
//     $sql = "DELETE FROM users WHERE id = ?";
//     $stmt = $conn->prepare($sql);
//     $stmt->bind_param('i', $userId);
//     if ($stmt->execute()) {
//         return true;
//     } else {
//         return false;
//     }
// }

?>