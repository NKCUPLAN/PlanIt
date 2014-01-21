/*------Initialization------*/
$(document).ready(function(){	

});

/*------Event Handler------*/
$(document).ready(function(){	
	$('#btn_dialog_friend_close').click(function(){
		$('#dialog_friend').modal();
		$('#dialog_friend').modal('hide');
	});
	
	$('#menu_friend').click(LoadFriends);
	$('#btn_dialog_friend_prev').click(LoadFriends);
	$('#friend_search_background').click(SearchFriends);
	
	$('#friend_search').click(function(){
		event.stopPropagation();
	});
});

var SearchFriends = function(){
	$.ajax({
		url: 'php/searchFriends.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: {
			keyword: $('#friend_search').val().trim(),
			secret: window.sessionStorage["secret"]
		},
		error: function(xhr) {
			alert('Wrong Network');
		},
		success: function(response) {
			var total = 0;
			$('#friend_list').empty();
			$('#friend_list').append(
				'<div class="friend_Friend"></div>\
				<div class="friend_Invite"></div>\
				<div class="friend_Invited"></div>\
				<div class="friend_Stranger"></div>'
			);
			var list = $.parseJSON(response);

			var friends = $.parseJSON(list['friend']);
			var stranger = $.parseJSON(list['stranger']);
			var invited = $.parseJSON(list['invited']);
			var invite = $.parseJSON(list['invite']);

			for(var k in friends){
				total++;
				var friend = $.parseJSON(friends[k]);

				var block = SetFriend('Friend', friend).appendTo($('.friend_Friend'));
				block.slideToggle(1000);
			}

			for(var k in invite){
				total++;
				var friend = $.parseJSON(invite[k]);
				
				var block = SetFriend('Invite', friend).appendTo($('.friend_Invite'));	
				block.slideToggle(1000);
			}

			for(var k in invited){
				total++;
				var friend = $.parseJSON(invited[k]);
				
				var block = SetFriend('Invited', friend).appendTo($('.friend_Invited'));	
				block.slideToggle(1000);
			}

			for(var k in stranger){
				total++;
				var friend = $.parseJSON(stranger[k]);

				var block = SetFriend('Stranger', friend).appendTo($('.friend_Stranger'));
				block.slideToggle(1000);
			}
			
			$('#friend_text').text("搜尋結果");
			$('#friend_number').text(total);
			
			$('#btn_dialog_friend_prev').show(1);
		}
	});
}

var LoadFriends = function(){
	$.ajax({
		url: 'php/loadFriends.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: {
			secret: window.sessionStorage["secret"]
		},
		error: function(xhr) {
			alert('Wrong Network');
		},
		success: function(response) {
			$('#friend_list').empty();
			$('#friend_search').val('');
			$('#friend_list').append(
				'<div class="friend_Friend"></div>\
				<div class="friend_Invite"></div>\
				<div class="friend_Invited"></div>'
			);
			var data = $.parseJSON(response);

			var invited = $.parseJSON(data[0]);
			var friends = $.parseJSON(data[1]);
			var invite = $.parseJSON(data[2]);
			
			var total = 0;
			for(var k in friends){
				total++;
				var friend = $.parseJSON(friends[k]);

				var block = SetFriend('Friend', friend).appendTo($('.friend_Friend'));
				block.slideToggle(1000);
			}

			for(var k in invite){
				total++;
				var friend = $.parseJSON(invite[k]);
				
				var block = SetFriend('Invite', friend).appendTo($('.friend_Invite'));	
				block.slideToggle(1000);
			}

			for(var k in invited){
				total++;
				var friend = $.parseJSON(invited[k]);
				
				var block = SetFriend('Invited', friend).appendTo($('.friend_Invited'));	
				block.slideToggle(1000);
			}

			$('#friend_text').text("好友(包括邀請)");
			$('#friend_number').text(total);
			$('#btn_dialog_friend_prev').hide(1);
		}
	});
}

var SetFriend = function(type, friend){
	if(type == 'Invite'){
		var block = $(
			'<li class="friend_block">\
				<div class="profile_id">ID: '+friend['acc']+'</div>\
				<div class="profile_pic" \
					style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
					background-size: 100% 100%;">\
				</div>\
				<div class="friend_text profile_name">'+friend['name']+'</div>\
				<div class="friend_ask">已送出邀請</div>\
				<div class="btn_friendCancel"></div>\
			</li>');
		SetUpdateFriendButton('Cancel', block, friend);
		return block;
	}
	else if(type == 'Friend'){
		var block = $(
			'<li class="friend_block">\
				<div class="profile_id">ID: '+friend['acc']+'</div>\
				<div class="profile_pic" \
					style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
					background-size: 100% 100%; cursor: pointer;"\
					onclick="LoadFriendsPlans('+friend['id']+',false)"\
				>\
				</div>\
				<div class="friend_text profile_name">'+friend['name']+'</div>\
				<div class="friend_recentUpdate" >最近更新計畫 :</div>\
				<div class="friend_text friend_planName" onclick="LoadFriendsPlans('+friend['id']+',true)">'+friend['plan_name']+'</div>\
				<div class="friend_sure"></div>\
				<div class="btn_friendDelete"></div>\
			</li>');
		SetUpdateFriendButton('Delete', block, friend);
		return block;
	}
	else if(type == 'Invited'){
		var block = $(
			'<li class="friend_block">\
				<div class="profile_id">ID: '+friend['acc']+'</div>\
				<div class="profile_pic" \
					style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
					background-size: 100% 100%;">\
				</div>\
				<div class="friend_text profile_name">'+friend['name']+'</div>\
				<div class="friend_ask">想成為你的朋友</div>\
				<div class="btn_friendConfirm"></div>\
				<div class="btn_friendRefuse"></div>\
			</li>');
		SetUpdateFriendButton('Confirm', block, friend);
		SetUpdateFriendButton('Refuse', block, friend);
		return block;
	}
	else if(type == 'Stranger'){
		var block = $(
			'<li class="friend_block">\
				<div class="profile_id">ID: '+friend['acc']+'</div>\
				<div class="profile_pic" \
					style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
					background-size: 100% 100%;">\
				</div>\
				<div class="friend_text profile_name">'+friend['name']+'</div>\
				<div class="friend_ask">你們還不是朋友</div>\
				<div class="btn_friendInvite"></div>\
			</li>');
		SetUpdateFriendButton('Invite', block, friend);
		return block;
	}
}

var SetUpdateFriendButton = function(type, block, friendData){
	block.children('.btn_friend' + type).click(function(){
		$.ajax({
			url: 'php/updateFriend.php',
			cache: false,
			dataType: 'html',
			type:'POST',
			data: {
				act: type,
				secret: window.sessionStorage["secret"],
				friend: friendData['id']
			},
			error: function(xhr) {
				alert('Wrong Network');
			},
			success: function(response){
				block.children('.btn_friend' + type).unbind('click');
				block.slideToggle(600, function(){
					block.remove();
				});
				var data = $.parseJSON(response);
				var block2 = SetFriend(data['relation'], data).appendTo($('.friend_'+data['relation']));
				block2.slideToggle(600);
			}
		});
	});
}

var LoadFriendsPlans = function(friend_id, go_recent){
	$.ajax({
		url: 'php/loadFriendPlans.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			id: friend_id
		},
		error: function(xhr) {
			return false;
		},
		success: function(response) {
			$('#book').children().remove();
			$('#list_plans').empty();
			$('#list_plans').append('<div id="list_undone"></div>');
			$('#list_plans').append('<div id="list_done"></div>');
			$('#list_plans').append('<div id="list_expired"></div>');
			
			$('#aside_checkboxs input[type=checkbox]').prop('checked', 'checked');
			
			$('#menu_friend_back').show(1);
			$('#menu_friend_back').click(function(){
				$('#menu_friend_back').unbind('click');
				$('#menu_friend_back').hide(1);
				LoadPlans(secret);
			});

			if(pages.length)
				pages.length = 0;

			var planPacket = $.parseJSON(response);
			var most_recent = 1;
			
			var undone = $.parseJSON(planPacket['undone']);
			var done = $.parseJSON(planPacket['done']);
			var expired = $.parseJSON(planPacket['expired']);
			var user_info = $.parseJSON(planPacket['user_info']);
			
			pages.push(AddPersonalPage(user_info, false));
			
			
			for(var i in undone){
				var planData = $.parseJSON(undone[i]);
				AddPlanPage(planData, false, $('#list_undone'));
				if(go_recent && parseInt(planData['isRecent'])){
					most_recent = pages.length - 1;
				}
			}
			
			for(var i in done){
				var planData = $.parseJSON(done[i]);
				AddPlanPage(planData, false, $('#list_done'));
				if(go_recent && parseInt(planData['isRecent'])){
					most_recent = pages.length - 1;
				}
			}
			
			for(var i in expired){
				var planData = $.parseJSON(expired[i]);
				AddPlanPage(planData, false, $('#list_expired'));
				if(go_recent && parseInt(planData['isRecent'])){
					most_recent = pages.length - 1;
				}
			}
			
			$('#aside_contents li, #new_plan').bind({
				mouseenter: function(){
					$(this).css('color', 'yellow');
					$(this).css('cursor', 'pointer');
				},
				mouseleave: function(){
					$(this).css('color', 'brown');
				}
			});
			
			$('#aside_contents li').each(function(i){
				$(this).click(function(){
					TurnToPage(2*i+2);
				});
			});
			
			$('#new_plan').unbind('click');
			
			$('#aside_personalinfo').unbind('click').click(function(){	
				TurnToPage(1);
			});
			
			$('#new_plan').unbind();
			$('#book').bookblock();
			TurnToPage(most_recent);
			
			$('#dialog_friend').modal();
			$('#dialog_friend').modal('hide');
		}
	});
}