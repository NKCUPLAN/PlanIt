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
		if($user != $k['id']){
			$data = null;
			$data['name'] = $k['first_name'].$k['last_name'];
			$data['male'] = $k['male'];
			$data['id'] = $k['id'];
			$data['acc'] = $k['acc'];
			
			if(isFriend($user, $k['id'])){
				$res = mysql_fetch_array(mysql_query("SELECT name FROM 2_plan WHERE user_id = '".$k['id']."' ORDER BY update_time DESC LIMIT 1"));
				$data['plan_name'] = $res[0];
				$friend[] = json_encode($data);
			}
			else if(isInvited($user, $k['id'])){	
				$invited[] = json_encode($data);
			}
			else if(isInvite($user, $k['id'])){	
				$invite[] = json_encode($data);
			}
			else{
				$stranger[] = json_encode($data);
			}
		}
	}
	$result['friend'] = json_encode($friend);
	$result['invited'] = json_encode($invited);
	$result['stranger'] = json_encode($stranger);
	$result['invite'] = json_encode($invite);
	echo json_encode($result);
	
	mysql_close();
?>
