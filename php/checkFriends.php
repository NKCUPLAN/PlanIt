
<?php 
function isFriend($id1, $id2){
	$query1 = "SELECT COUNT(*) FROM 2_friend WHERE id1='$id1' AND id2='$id2'";
	$re1 = mysql_fetch_row(mysql_query($query1));
	$query2 = "SELECT COUNT(*) FROM 2_friend WHERE id1='$id2' AND id2='$id1'";
	$re2 = mysql_fetch_row(mysql_query($query2));
	
	if($re1[0] && $re2[0]){
		return true; //have registered before
	}
	
	return false;
}

function isInvite($id1, $id2){
	$query1 = "SELECT COUNT(*) FROM 2_friend WHERE id1='$id1' AND id2='$id2'";
	$re1 = mysql_fetch_row(mysql_query($query1));

	if($re1[0]){
		return true; //have registered before
	}
	return false;
}

function isInvited($id1, $id2){
	$query1 = "SELECT COUNT(*) FROM 2_friend WHERE id1='$id2' AND id2='$id1'";
	$re1 = mysql_fetch_row(mysql_query($query1));

	if($re1[0]){
		return true; //have registered before
	}
	return false;
}

?> 