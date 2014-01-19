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
	$tasks = $_POST['taskData'];
	
	date_default_timezone_set('Asia/Taipei');
	$create_time = date("Y-m-d h:i:s");
	
	$query = "SELECT id FROM 2_member WHERE secret = '$secret'";
	$re = mysql_fetch_assoc(mysql_query($query));
	$user_id = $re['id'];
	
	$query = "INSERT INTO 2_plan VALUES('', '$user_id', '$name', '$content', '$start', '$end', '$now', '$unit', '$deadline', '$create_time', '$create_time')";
	$re = mysql_query($query);
	
	$query = "SELECT MAX(id) FROM 2_plan";
	$re = mysql_fetch_array(mysql_query($query));
	
	$plan_id = $re[0];

	foreach($tasks as $task){
		$task_content = $task['content'];
		$task_done = ($task['done'] == "true")? 1:0;
		mysql_query("INSERT INTO 2_task VALUES('', '$plan_id', '$task_content', '$task_done')");
	}
	
	$data = null;
	//Task
	$res = mysql_query("SELECT * FROM 2_task WHERE plan_id = '$plan_id'");
	
	$task = null;
	while($m = mysql_fetch_assoc($res)){
		$task[] = json_encode($m);
	}
	$data['task'] = json_encode($task);
	
	
	$data['plan_id'] = $plan_id;
	echo json_encode($data);
	

	mysql_close();
?>