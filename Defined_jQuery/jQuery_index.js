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
				
				var uninvited = $.parseJSON(list[0]);
				var invited = $.parseJSON(list[1]);
				
				for(var k in uninvited){
					total++;
					var friend = $.parseJSON(uninvited[k]);
					var block = $(
						'<li class="friend_block" class="friend_owned">\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">ID: '+friend['acc']+'<br/>尚未加入好友</div>\
							<div class="btn_friendInvite"></div>\
						</li>').appendTo($('#friend_list'));
						
					block.children('.btn_friendInvite').click(function(){
						$.ajax({
							url: 'php/updateFriend.php',
							cache: false,
							dataType: 'html',
							type:'POST',
							data: {
								act: "invite",
								secret: window.sessionStorage["secret"],
								friend: friend['id']
							},
							error: function(xhr) {
								alert('Wrong Network');
							},
							success: function(response){
								loadFriends();
							}
						});
					});
				}
				
				for(var k in invited){
					total++;
					var friend = $.parseJSON(invited[k]);
					var block = $(
						'<li class="friend_block" class="friend_confirm">\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">已送出好友邀請</div>\
							<div class="btn_friendCancel"></div>\
						</li>').appendTo($('#friend_list'));
						
					block.children('.btn_friendInvite').click(function(){
						$.ajax({
							url: 'php/updateFriend.php',
							cache: false,
							dataType: 'html',
							type:'POST',
							data: {
								act: "invite",
								secret: window.sessionStorage["secret"],
								friend: friend['id']
							},
							error: function(xhr) {
								alert('Wrong Network');
							},
							success: function(response){
								loadFriends();
							}
						});
					});
				}
				$('#friend_text').text("未成為好友");
				$('#friend_number').text(total);
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
						<div class="profile_pic" \
							style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
							background-size: 100% 100%;">\
						</div>\
						<div class="friend_text profile_name">'+friend['name']+'</div>\
						<div class="friend_ask">想成為你的朋友</div>\
						<div class="btn_friendConfirm"></div>\
						<div class="btn_friendRefuse"></div>\
					</li>').appendTo($('#friend_list'));
				block.children('.btn_friendConfirm').click(function(){
					$.ajax({
						url: 'php/updateFriend.php',
						cache: false,
						dataType: 'html',
						type:'POST',
						data: {
							act: "confirm",
							secret: window.sessionStorage["secret"],
							friend: friend['id']
						},
						error: function(xhr) {
							alert('Wrong Network');
						},
						success: function(response){
							loadFriends();
						}
					});
				});
				
				block.children('.btn_friendRefuse').click(function(){
					$.ajax({
						url: 'php/updateFriend.php',
						cache: false,
						dataType: 'html',
						type:'POST',
						data: {
							act: "refuse",
							secret: window.sessionStorage["secret"],
							friend: friend['id']
						},
						error: function(xhr) {
							alert('Wrong Network');
						},
						success: function(response){
							loadFriends();
						}
					});
				});
			}
			
			for(var k in sure){
				total++;
				var friend = $.parseJSON(sure[k]);
				var block = $(
					'<li class="friend_block" class="friend_owned">\
						<div class="profile_pic" \
							style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
							background-size: 100% 100%;">\
						</div>\
						<div class="friend_text profile_name">'+friend['name']+'</div>\
						<div class="friend_recentUpdate">最近更新計畫 :</div>\
						<div class="friend_text friend_planName">'+friend['plan_name']+'</div>\
						<div class="btn_friendDelete"></div>\
					</li>').appendTo($('#friend_list'));
					
				block.children('.btn_friendDelete').click(function(){
					$.ajax({
						url: 'php/updateFriend.php',
						cache: false,
						dataType: 'html',
						type:'POST',
						data: {
							act: "delete",
							secret: window.sessionStorage["secret"],
							friend: friend['id']
						},
						error: function(xhr) {
							alert('Wrong Network');
						},
						success: function(response){
							loadFriends();
						}
					});
				});
			}
			
			for(var k in unsure){
				total++;
				var friend = $.parseJSON(unsure[k]);
				var block = $(
					'<li class="friend_block" class="friend_confirm">\
						<div class="profile_pic" \
							style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
							background-size: 100% 100%;">\
						</div>\
						<div class="friend_text profile_name">'+friend['name']+'</div>\
						<div class="friend_ask">已送出好友邀請</div>\
						<div class="btn_friendCancel"></div>\
					</li>').appendTo($('#friend_list'));
				
				block.children('.btn_friendCancel').click(function(){
					$.ajax({
						url: 'php/updateFriend.php',
						cache: false,
						dataType: 'html',
						type:'POST',
						data: {
							act: "delete",
							secret: window.sessionStorage["secret"],
							friend: friend['id']
						},
						error: function(xhr) {
							alert('Wrong Network');
						},
						success: function(response){
							loadFriends();
						}
					});
				});
			}
			$('#friend_text').text("好友(包括邀請)");
			$('#friend_number').text(total);
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

