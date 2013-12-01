<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$secret = $_POST['secret'];
	$name = $_POST['name'];
	$now = $_POST['now'];
	
	date_default_timezone_set('Asia/Taipei');
	$create_time = date("Y-m-d h:i:s");
	
	$query = "SELECT id FROM 2_member WHERE secret = '$secret'";
	$re = mysql_fetch_assoc(mysql_query($query));
	$user_id = $re['id'];
	
	$query = "UPDATE 2_plan SET now='$now' WHERE user_id = $user_id AND name = $name";
	echo mysql_query($query) or die(mysql_error());
	
	mysql_close();
?>