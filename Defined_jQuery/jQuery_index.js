/*------Initialization------*/
$(document).ready(function(){	

});

/*------Event Handler------*/
$(document).ready(function(){	
	$(document).ajaxStart(function(){
		Loading();
	});
	$(document).ajaxComplete(function(){
		Loaded();
	});
	
	$('.unauth').css('display', 'none');
	
	$.ajax({
		url: 'php/loginAuto.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			secret: window.localStorage["secret"]
		},
		error: function(xhr) {
			alert("網路出現問題，請稍候再試!!");
		},
		success: function(response) {
			var data = $.parseJSON(response);
			if(data['msg'] == "success"){
				$(".auth").fadeIn(1000);
				
				first_name = data['first_name'];
				last_name = data['last_name'];
				secret = data['secret'];
				window.sessionStorage["secret"] = secret;
				
				LoadPlans(secret);
			}
			else{
				$('.unauth').fadeIn(1000);
			}
		}
	});
	
	$('#btn_dialog_friend_close').click(function(){
		$('#dialog_friend').modal();
		$('#dialog_friend').modal('hide');
	});
	
	$('#btn_dialog_friend_prev').click(function(){
		LoadFriends();
	});
	
	$('#menu_friend').click(LoadFriends);
	$('#friend_search').click(function(){
		event.stopPropagation();
	});
	$('#friend_search_background').click(SearchFriends);
	
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
				'<li class="friend_block friend_Friend" style="diplay:none;">\
				<li class="friend_block friend_Invite" style="diplay:none;">\
				<li class="friend_block friend_Invited" style="diplay:none;">\
				<li class="friend_block friend_Stranger" style="diplay:none;">'
			);
			var list = $.parseJSON(response);

			var friends = $.parseJSON(list['friend']);
			var stranger = $.parseJSON(list['stranger']);
			var invited = $.parseJSON(list['invited']);
			var invite = $.parseJSON(list['invite']);

			for(var k in friends){
				total++;
				var friend = $.parseJSON(friends[k]);

				var block = SetFriend('Friend', friend).insertAfter($('.friend_Friend:last-child'));
				block.slideToggle(500);
			}

			for(var k in invite){
				total++;
				var friend = $.parseJSON(invite[k]);
				
				var block = SetFriend('Invite', friend).insertAfter($('.friend_Invite:last-child'));	
				block.slideToggle(500);
			}

			for(var k in invited){
				total++;
				var friend = $.parseJSON(invited[k]);
				
				var block = SetFriend('Invited', friend).insertAfter($('.friend_Invited:last-child'));	
				block.slideToggle(500);
			}

			for(var k in stranger){
				total++;
				var friend = $.parseJSON(stranger[k]);

				var block = SetFriend('Stranger', friend).insertAfter($('.friend_Stranger:last-child'));
				block.slideToggle(500);
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
				'<li class="friend_block friend_Friend" style="diplay:none;"></li>\
				<li class="friend_block friend_Invite" style="diplay:none;"></li>\
				<li class="friend_block friend_Invited" style="diplay:none;"></li>'
			);
			var data = $.parseJSON(response);

			var wait_for_sure = $.parseJSON(data[0]);
			var sure = $.parseJSON(data[1]);
			var unsure = $.parseJSON(data[2]);
			
			var total = 0;
			
			for(var k in wait_for_sure){
				total++;
				var friend = $.parseJSON(wait_for_sure[k]);

				var block = SetFriend('Invited', friend).insertAfter($('.friend_Invited:last-child'));	
				block.slideToggle(500);
			}

			for(var k in sure){
				total++;
				var friend = $.parseJSON(sure[k]);

				var block = SetFriend('Friend', friend).insertAfter($('.friend_Friend:last-child'));
				block.slideToggle(500);
			}

			for(var k in unsure){
				total++;
				var friend = $.parseJSON(unsure[k]);

				var block = SetFriend('Invite', friend).insertAfter($('.friend_Invite:last-child'));
				block.slideToggle(500);
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
			'<li class="friend_block friend_Invite">\
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
			'<li class="friend_block friend_Friend">\
				<div class="profile_id">ID: '+friend['acc']+'</div>\
				<div class="profile_pic" \
					style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
					background-size: 100% 100%;">\
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
			'<li class="friend_block friend_Invited">\
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
			'<li class="friend_block friend_Stranger">\
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
				block.slideToggle(500);
				block.remove();
				
				var data = $.parseJSON(response);
				block = SetFriend(data['relation'],data);
				$('.friend_'+data['relation']+':last-child').after(block);
				block.slideToggle(500);
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
			
			if(pages.length)
				pages.length = 0;

			var planPacket = $.parseJSON(response);
			var most_recent = 1;
			
			for(var i in planPacket){
				var planData = $.parseJSON(planPacket[i]);
				$('#list_plans').append('<li>' + planData['name'] + '</li>');
				pages.push(AddPlanPage1(planData, false));
				pages.push(AddPlanPage2(planData, false));
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
					TurnToPage(2*i+1);
				});
			});
			
			$('#new_plan').unbind();
			$('#book').bookblock();
			TurnToPage(most_recent);
			
			$('#dialog_friend').modal();
			$('#dialog_friend').modal('hide');
		}
	});
}

var Loading = function(){
	$('#mask').show();
	$('#loading').animateImages('img/loading/loading_@.png', 5, 300);
	var h = $(window).height();
    var w = $(window).width();
	$('#loading').css('top', (h - $('#loading').height())/2);
	$('#loading').css('left', (w - $('#loading').width())/2);
}

var Loaded = function(){
	$('#loading').empty();
	$('#mask').hide();
}

