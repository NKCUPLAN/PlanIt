<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$id = $_POST['id'];
	$now = $_POST['now'];
	$tasks = $_POST['taskData'];
	
	date_default_timezone_set('Asia/Taipei');
	$update_time = date("Y-m-d h:i:s");

	mysql_query("UPDATE 2_plan SET now='$now', update_time='$update_time' WHERE id = '$id'");
	
	//Task
	mysql_query("DELETE FROM 2_task WHERE plan_id = '$id'");
	foreach($tasks as $task){
		$task_content = $task['content'];
		$task_done = ($task['done'] == "true")? 1:0;
		mysql_query("INSERT INTO 2_task VALUES('', '$id', '$task_content', '$task_done')");
	}
	
	mysql_close();
?>