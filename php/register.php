<?php
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$acc = $_POST['acc'];
	$pwd = $_POST['pwd'];
	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$mail = $_POST['mail'];
	$gender = $_POST['gender'];
	
	$query = "INSERT INTO 2_member VALUES('', '$acc', '$pwd', '$first_name', '$last_name', '$mail', '$gender')";
	$query = mysql_query($query);

	echo "success";
?>