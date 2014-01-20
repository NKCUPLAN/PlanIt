<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$id = $_POST['id'];
	$content = $_POST['content'];

	mysql_query("UPDATE 2_plan SET memo='$content' WHERE id = '$id'");
	
	mysql_close();
?>