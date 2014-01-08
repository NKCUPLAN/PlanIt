<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$plan_id = $_POST['plan_id'];
	$content = $_POST['content'];
	$secret = $_POST['secret'];
	
	$id = mysql_query("SELECT id, first_name, last_name FROM 2_member WHERE secret = '$secret'");
	$id = mysql_fetch_array($id);
	$user = $id[0];
	
	date_default_timezone_set('Asia/Taipei');
	$update_time = date("Y-m-d h:i:s");
	
	$query = "INSERT INTO 2_comment VALUES ('', '$plan_id', '$content', '$user', '$update_time')";
	mysql_query($query);
	
	//echo mysql_query($query) or die(mysql_error());
	echo $id[1].$id[2];
	
	mysql_close();
?>