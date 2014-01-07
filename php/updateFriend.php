<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$act = $_POST['act'];
	if($act == "delete"){
		
	}
	else{
		
	}
	
	
	mysql_close();
?>