<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	require_once('checkFriends.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$act = $_POST['act'];
	
	$secret = $_POST['secret'];
	$id = mysql_query("SELECT id FROM 2_member WHERE secret = '$secret'");
	$id = mysql_fetch_array($id);
	$user = $id[0];
	
	$friend = $_POST['friend'];
	
	if($act == "Confirm" || $act == "Invite"){
		mysql_query("INSERT INTO 2_friend VALUES ('$user', '$friend')");
	}
	else if($act == "Delete"){
		mysql_query("DELETE FROM 2_friend WHERE id1 = '$user' AND id2 = '$friend'");
		mysql_query("DELETE FROM 2_friend WHERE id1 = '$friend' AND id2 = '$user'");
	}
	else if($act == "Cancel"){
		mysql_query("DELETE FROM 2_friend WHERE id1 = '$user' AND id2 = '$friend'");
	}
	else if($act == "Refuse"){
		mysql_query("DELETE FROM 2_friend WHERE id1 = '$friend' AND id2 = '$user'");
	}
	
	$re = mysql_query("SELECT id, male, acc, first_name, last_name FROM 2_member WHERE id = '$friend'");
	$k = mysql_fetch_assoc($re);
	
	$data = null;
	$data['name'] = $k['first_name'].$k['last_name'];
	$data['male'] = $k['male'];
	$data['id'] = $k['id'];
	$data['acc'] = $k['acc'];
	
	if(isFriend($user, $k['id'])){
		$res = mysql_fetch_array(mysql_query("SELECT name FROM 2_plan WHERE user_id = '".$k['id']."' ORDER BY update_time DESC LIMIT 1"));
		$data['plan_name'] = $res[0];
		$data['relation'] = 'Friend';
	}
	else if(isInvited($user, $k['id'])){
		$data['relation'] = 'Invited';
	}
	else if(isInvite($user, $k['id'])){	
		$data['relation'] = 'Invite';
	}
	else{
		$data['relation'] = 'Stranger';
	}
	echo json_encode($data);
	
	mysql_close();
?>