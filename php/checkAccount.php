<?php
	require_once('connect.php');
	
	$acc = $_POST['acc'];
	
	$query = "SELECT COUNT(*) FROM 2_member WHERE acc='$acc'";
	$re = mysql_fetch_row(mysql_query($query));
	if($re[0]){
		echo "used"; //have registered before
	}
?>