<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$secret = $_POST['secret'];

	$re = mysql_query("SELECT * FROM 2_plan WHERE user_id = (SELECT id FROM 2_member WHERE secret = '$secret')");
	
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

		//$result[] = json_encode($data);
		date_default_timezone_set('Asia/Taipei');
		$current_time = date("Y-m-d h:i:s");		

		if(strtotime($current_time) < strtotime($k['deadline']))
			$undone[] = json_encode($data);
		else
			$done[] = json_encode($data);
	}
	$result['done'] = json_encode($done);
	$result['undone'] = json_encode($undone);
	echo json_encode($result);

	mysql_close();
?>