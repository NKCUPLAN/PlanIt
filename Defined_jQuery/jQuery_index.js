﻿/*------Initialization------*/
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
	
	$('#btn_dialog_friend_close').click(function(){
		$('#dialog_friend').modal();
		$('#dialog_friend').modal('hide');
	});
	
	$('#btn_dialog_friend_prev').click(function(){
		loadFriends();
	});
	
	$('#menu_friend').click(loadFriends);
	$('#friend_search').click(function(){
		event.stopPropagation();
	});
	$('#friend_search_background').click(function(){
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
				var list = $.parseJSON(response);
				
				var friends = $.parseJSON(list['friend']);
				var uninvited = $.parseJSON(list['uninvited']);
				var invited = $.parseJSON(list['invited']);
				
				for(var k in friends){
					total++;
					var friend = $.parseJSON(friends[k]);

					var block = $(
						'<li class="friend_block" class="friend_owned">\
							<div class="profile_id">ID: '+friend['acc']+'</div>\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_recentUpdate"">最近更新計畫 :</div>\
							<div class="friend_text friend_planName" onclick="LoadFriendsPlans('+friend['id']+',true)">'+friend['plan_name']+'</div>\
							<div class="friend_sure"></div>\
							<div class="btn_friendDelete"></div>\
						</li>').appendTo($('#friend_list'));
						
					SetUpdateFriendButton('Delete', block, friend);
				}
				
				for(var k in invited){
					total++;
					var friend = $.parseJSON(invited[k]);
					var block = $(
						'<li class="friend_block" class="friend_confirm">\
							<div class="profile_id">ID: '+friend['acc']+'</div>\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">已送出邀請</div>\
							<div class="btn_friendCancel"></div>\
						</li>').appendTo($('#friend_list'));
						
					SetUpdateFriendButton('Cancel', block, friend);
				}
				
				for(var k in uninvited){
					total++;
					var friend = $.parseJSON(uninvited[k]);

					var block = $(
						'<li class="friend_block" class="friend_owned">\
							<div class="profile_id">ID: '+friend['acc']+'</div>\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">你們還不是朋友</div>\
							<div class="btn_friendInvite"></div>\
						</li>').appendTo($('#friend_list'));
					SetUpdateFriendButton('Invite', block, friend);
				}
				
				$('#friend_text').text("搜尋結果");
				$('#friend_number').text(total);
				
				$('#btn_dialog_friend_prev').show(1);
			}
		});
	});
	
});

var loadFriends = function(){
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
		
			var data = $.parseJSON(response);

			var wait_for_sure = $.parseJSON(data[0]);
			var sure = $.parseJSON(data[1]);
			var unsure = $.parseJSON(data[2]);
			
			var total = 0;
			
			for(var k in wait_for_sure){
				total++;
				var friend = $.parseJSON(wait_for_sure[k]);

				var block = $(
					'<li class="friend_block" class="friend_confirm">\
						<div class="profile_id">ID: '+friend['acc']+'</div>\
						<div class="profile_pic" \
							style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
							background-size: 100% 100%;">\
						</div>\
						<div class="friend_text profile_name">'+friend['name']+'</div>\
						<div class="friend_ask">想成為你的朋友</div>\
						<div class="btn_friendConfirm"></div>\
						<div class="btn_friendRefuse"></div>\
					</li>').appendTo($('#friend_list'));
				
				SetUpdateFriendButton('Confirm', block, friend);
				SetUpdateFriendButton('Refuse', block, friend);
			}
			
			for(var k in sure){
				total++;
				var friend = $.parseJSON(sure[k]);

				var block = $(
					'<li class="friend_block" class="friend_owned">\
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
					</li>').appendTo($('#friend_list'));
					
				SetUpdateFriendButton('Delete', block, friend);
			}
			
			for(var k in unsure){
				total++;
				var friend = $.parseJSON(unsure[k]);

				var block = $(
					'<li class="friend_block" class="friend_confirm">\
						<div class="profile_id">ID: '+friend['acc']+'</div>\
						<div class="profile_pic" \
							style="background:url(img/friend/'+((parseInt(friend['male']))? "profileBoy":"profileGirl") +'.png) no-repeat; \
							background-size: 100% 100%;">\
						</div>\
						<div class="friend_text profile_name">'+friend['name']+'</div>\
						<div class="friend_ask">已送出邀請</div>\
						<div class="btn_friendCancel"></div>\
					</li>').appendTo($('#friend_list'));
				
				SetUpdateFriendButton('Cancel', block, friend);
			}
			$('#friend_text').text("好友(包括邀請)");
			$('#friend_number').text(total);
			$('#btn_dialog_friend_prev').hide(1);
		}
	});
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
				//loadFriends();
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

