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
	
	$('#menu_friend').click(function(){
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
					$('#friend_list').append(
						'<li class="friend_block" class="friend_confirm">\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">想成為你的朋友</div>\
							<div class="btn_friendConfirm"></div>\
							<div class="btn_friendRefuse"></div>\
						</li>');
				}
				
				for(var k in sure){
					total++;
					var friend = $.parseJSON(sure[k]);
					$('#friend_list').append(
						'<li class="friend_block" class="friend_owned">\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_recentUpdate">最近更新計畫 :</div>\
							<div class="friend_text friend_planName">'+friend['plan_name']+'</div>\
							<div class="btn_friendDelete"></div>\
						</li>');
				}
				
				for(var k in unsure){
					total++;
					var friend = $.parseJSON(unsure[k]);
					$('#friend_list').append(
						'<li class="friend_block" class="friend_confirm">\
							<div class="profile_pic" \
								style="background:url(img/friend/'+((friend['male'])? "profileBoy":"profileGirl") +'.png) no-repeat; \
								background-size: 100% 100%;">\
							</div>\
							<div class="friend_text profile_name">'+friend['name']+'</div>\
							<div class="friend_ask">已送出好友邀請</div>\
							<div class="btn_friendDelete"></div>\
						</li>');
				}
				
				$('#friend_number').text(total);
							
				//alert(wait_for_sure+ "\n" + sure + "\n" + unsure + "\n");
				//$('#friend_list').appendTo()
			}
		});
		
	});
});

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

