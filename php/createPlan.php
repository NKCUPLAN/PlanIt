<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$secret = $_POST['secret'];
	$name = $_POST['name'];
	$content = $_POST['content'];
	$start = $_POST['start'];
	$end = $_POST['end'];
	$now = $_POST['now'];
	$unit = $_POST['unit'];
	$deadline = $_POST['deadline'];
	
	date_default_timezone_set('Asia/Taipei');
	$create_time = date("Y-m-d h:i:s");
	
	$query = "SELECT id FROM 2_member WHERE secret = '$secret'";
	$re = mysql_fetch_assoc(mysql_query($query));
	$user_id = $re['id'];
	
	$query = "INSERT INTO 2_plan VALUES('', '$user_id', '$name', '$content', '$start', '$end', '$now', '$unit', '$deadline', '$create_time')";
	echo mysql_query($query) or die(mysql_error());
	
	mysql_close();
?>