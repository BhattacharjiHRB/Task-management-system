<?php

$sName = "127.0.0.1";
$uName = "root";
$pass  = "";
$db_name = "task_management_db";

try {
	$conn = mySqli_connect($sName, $uName, $pass, $db_name);
	if (!$conn) {
		throw new Exception("Connection failed: " . mySqli_connect_error());
	}
}catch(PDOException $e){
	echo "Connection failed: ". $e->getMessage();
	exit;
}
?>