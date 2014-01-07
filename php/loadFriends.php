<?php
	header("Content-Type: text/html; charset=utf-8");
	
	require_once('connect.php');
	require_once('checkFriends.php');
	mysql_query("SET NAMES 'UTF8'");
	
	$secret = $_POST['secret'];
	
	$id = mysql_query("SELECT id FROM 2_member WHERE secret = '$secret'");
	$id = mysql_fetch_array($id);
	$user = $id[0];

	$re = mysql_query("SELECT * FROM 2_friend WHERE id2 = '$user'");
	while($k = mysql_fetch_assoc($re)){
		$friend = $k['id1'];
		if(isFriend($user, $friend)){
			$data = NULL;
			$res = mysql_fetch_array(mysql_query("SELECT first_name, last_name, male FROM 2_member WHERE id = '$friend'"));
			$data['name'] = $res[0].$res[1];
			$data['male'] = $res[2];
			$data['id'] = $friend;
			$res = mysql_fetch_array(mysql_query("SELECT name FROM 2_plan WHERE user_id = '$friend' ORDER BY update_time DESC LIMIT 1"));
			$data['plan_name'] = $res[0];
			
			$sure[] = json_encode($data);
		}
		else{
			$data = NULL;
			$res = mysql_fetch_array(mysql_query("SELECT first_name, last_name, male FROM 2_member WHERE id = '$friend'"));
			$data['name'] = $res[0].$res[1];
			$data['male'] = $res[2];
			$data['id'] = $friend;
			
			$wait_for_sure[] = json_encode($data);
		}
	}
	$sure = json_encode($sure);
	$wait_for_sure = json_encode($wait_for_sure);
	
	$re = mysql_query("SELECT * FROM 2_friend WHERE id1 = '$user'");
	while($k = mysql_fetch_assoc($re)){
		$friend = $k['id2'];
		if(!isFriend($user, $friend)){
			$data = NULL;
			$res = mysql_fetch_array(mysql_query("SELECT first_name, last_name, male FROM 2_member WHERE id = '$friend'"));
			$data['name'] = $res[0].$res[1];
			$data['male'] = $res[2];
			$data['id'] = $friend;
			
			$unsure[] = json_encode($data);
		}
	}
	$unsure = json_encode($unsure);
	
	$result[] = $wait_for_sure;
	$result[] = $sure;
	$result[] = $unsure;
	
	echo json_encode($result);
	
	mysql_close();
?>
