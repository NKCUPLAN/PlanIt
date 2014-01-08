<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$id = $_POST['id'];

	$re = mysql_query("SELECT * FROM 2_plan WHERE user_id = '$id'");
	
	while($k = mysql_fetch_assoc($re)){
		$data = null;
		$data = $k;
		
		$plan_id = $k['id'];
		$res = mysql_query("SELECT * FROM 2_comment WHERE plan_id = '$plan_id'");
		
		$comment = null;
		while($m = mysql_fetch_assoc($res)){
			$user_id = $m['user_id'];
			$user = mysql_fetch_array(mysql_query("SELECT first_name, last_name FROM 2_member WHERE id = '$user_id'"));
			$m['user_name'] = $user[0].$user[1];

			$comment[] = json_encode($m);
		}
		
		$data['comment'] = json_encode($comment);
		
		$result[] = json_encode($data);
	}

	echo json_encode($result);
	
	mysql_close();
?>