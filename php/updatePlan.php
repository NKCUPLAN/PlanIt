<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$id = $_POST['id'];
	$now = $_POST['now'];
	$content = $_POST['content'];

	$query = "UPDATE 2_plan SET now='$now', content='$content' WHERE id = '$id'";
	echo mysql_query($query) or die(mysql_error());
	
	mysql_close();
?>