<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$acc = $_POST['acc'];
	$pwd = $_POST['pwd'];
	
	$query = "SELECT * FROM 2_member WHERE acc='$acc' AND pwd='$pwd' ";
	$re = mysql_fetch_assoc(mysql_query($query));
	
	if($re){
		$result['msg'] = "success";
		$result['first_name'] = $re['first_name'];
		$result['last_name'] = $re['last_name'];
		$result['secret'] = $re['secret'];
		$result['male'] = $re['male'];
	}
	else{
		$result['msg'] = "fail";
	}
	
	echo json_encode($result);	
	
	mysql_close();
	
?>