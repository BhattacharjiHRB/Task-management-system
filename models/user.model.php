<?php

function create_user($conn, $data){
    $sql = "INSERT INTO users (username, full_name, password, role) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt -> execute($data)
}


?>