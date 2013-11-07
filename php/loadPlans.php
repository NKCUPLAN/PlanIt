<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$acc = $_POST['acc'];
	
	$query = "SELECT * FROM 2_plan WHERE user_id = (SELECT id FROM 2_member WHERE acc = '$acc') ";
	$re = mysql_query($query);
	
	while($k = mysql_fetch_assoc($re)){
		$result[] = $k;
	}
	
	echo json_encode($result);
	
	mysql_close();
?>