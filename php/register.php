<?php
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$acc = $_POST['acc'];
	$pwd = $_POST['pwd'];
	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$mail = $_POST['mail'];
	$gender = $_POST['gender'];

	$hash = hash('ripemd160', $acc.$pwd);
	$query = "SELECT * FROM 2_member WHERE acc = '$acc'";
	$re = mysql_query($query) or die(0);
	$re = mysql_fetch_assoc($re);

	if($re){
		echo "used";
	}
	else{
		date_default_timezone_set('Asia/Taipei');
		$create_time = date("Y-m-d h:i:s");
	
		$query = "INSERT INTO 2_member VALUES('', '$acc', '$pwd', '$first_name', '$last_name', '$mail', '$gender', '$hash', '$create_time')";
		$re = mysql_query($query) or die(0);
		
		if($re)
			echo "success";
		else
			echo "fail";
	}
?>