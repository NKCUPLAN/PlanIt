<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	require_once('checkFriends.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$keyword = $_POST['keyword'];
	
	$secret = $_POST['secret'];
	$id = mysql_query("SELECT id FROM 2_member WHERE secret = '$secret'");
	$id = mysql_fetch_array($id);
	$user = $id[0];

	$re = mysql_query("SELECT id, male, acc, first_name, last_name FROM 2_member WHERE acc LIKE '%$keyword%'");
	while($k = mysql_fetch_assoc($re)){
		
		if(!isFriend($user, $k['id']) && $user != $k['id']){
			
			$data = null;
			$data['name'] = $k['first_name'].$k['last_name'];
			$data['male'] = $k['male'];
			$data['id'] = $k['id'];
			$data['acc'] = $k['acc'];
			
			if(!isInvited($user, $k['id'])){	
				$uninvited[] = json_encode($data);
			}
			else{
				$invited[] = json_encode($data);
			}
		}
	}
	$result[] = json_encode($uninvited);
	$result[] = json_encode($invited);
	echo json_encode($result);
	
	mysql_close();
?>
