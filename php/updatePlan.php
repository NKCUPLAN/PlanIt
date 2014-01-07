<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$id = $_POST['id'];
	$now = $_POST['now'];
	$content = $_POST['content'];
	
	date_default_timezone_set('Asia/Taipei');
	$update_time = date("Y-m-d h:i:s");
	
	echo $now.$content."\n";
	$query = "UPDATE 2_plan SET now='$now', content='$content', update_time='$update_time' WHERE id = '$id'";
	echo mysql_query($query) or die(mysql_error());
	
	mysql_close();
?>