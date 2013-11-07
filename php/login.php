<?php
	/*require_once('connect.php');
	
	$acc = $_POST['acc'];
	$pwd = $_POST['pwd'];
	
	$query = "SELECT COUNT(*) FROM 2_member WHERE acc='$acc' AND pwd='$pwd' ";
	$re = mysql_fetch_row(mysql_query($query));
	if($re[0])
		echo "success";
	else
		echo "fail";
		
	mysql_close();
	*/
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$acc = $_POST['acc'];
	$pwd = $_POST['pwd'];
	
	$query = "SELECT * FROM 2_member WHERE acc='$acc' AND pwd='$pwd' ";
	$re = mysql_fetch_assoc(mysql_query($query));
	
	if($re['id']){
		$result['msg'] = "success";
		$result['first_name'] = $re['first_name'];
		$result['last_name'] = $re['last_name'];
	}
	else
		$result['msg'] = "success";
		
	echo json_encode($result);	
	
	mysql_close();
	
?>