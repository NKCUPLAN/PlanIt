<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$act = $_POST['act'];
	
	$secret = $_POST['secret'];
	$id = mysql_query("SELECT id FROM 2_member WHERE secret = '$secret'");
	$id = mysql_fetch_array($id);
	$user = $id[0];
	
	$friend = $_POST['friend'];
	
	if($act == "confirm" || $act == "invite"){
		$query = "INSERT INTO 2_friend VALUES ('$user', '$friend')";
	}
	else if($act == "delete"){
		$query = "DELETE FROM 2_friend WHERE id1 = '$user' AND id2 = '$friend'";
	}
	else if($act == "refuse"){
		$query = "DELETE FROM 2_friend WHERE id1 = '$friend' AND id2 = '$user'";
	}
	
	echo mysql_query($query) or die(mysql_error());
	
	mysql_close();
?>