var hide_aside;
var hide_dialog_login = true;
var hide_register = true;

var first_name, last_name;

var user_pages;

var new_page_num;

$(document).ready(function(){
	initialCSS();

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
				$('#menu_user').text(first_name+last_name);
				window.sessionStorage["secret"] = secret;
				
				LoadPlans(secret);
				AdjustBookSize();
			}
			else{
				$('.unauth').fadeIn(1000);
			}
		}
	});

	//-----------------------------------------------------------header
	$('#menu_logout').click(function(){
		$('.auth').fadeOut(1000, function(){
			$('.unauth').fadeIn(1000);
			$('.bb-item:not(#page_create)').remove();
			$('#list_plans li').remove();
		});
		ClearCookie();
	});
	
	
	//-----------------------------------------------------------aside
    $('#aside_switch').click(function(){
    	if(hide_aside){
        	$('aside').animate(
            	{'right':  -$('#aside_contents').width()},
                600
            );
		}
        else{
        	$('aside').animate(
            	{'right': 0},
                600
            );
		}
        hide_aside = !hide_aside;
    });
    
    $('#aside_switch').hover(
    	function(){
    		$(this).css('background', 'rgba(0, 0, 0, 0.5)');
    	},
        function(){
    		$(this).css('background', 'rgba(0, 0, 0, 0.2)');
    	}
    );
	
	$(window).resize(function(){
		AdjustBookSize();
	});

	//-----------------------------------------------------------dialog_login
	$('.loginButton').hover(
		function(){
    		$(this).css('background', 'rgba(0, 0, 0, 1)');
			$(this).css('color', 'yellow');
    	},
        function(){
    		$(this).css('background', 'rgba(0, 0, 0, 0)');
			$(this).css('color', 'white');
    	}
	);
	
	$('.loginButton.checkBox').each(function(i){
		$(this).click(function(){
			$(':checkBox').get(i).checked = !$(':checkBox').get(i).checked;
		});
		$(':checkBox').click(function(){
			$(':checkBox').get(i).checked = !$(':checkBox').get(i).checked;
		});
	});

	$('.loginButton.radio').each(function(i){
		$(this).click(function(){
			$(':radio').get(i).checked = true;
			$(':radio').get(i-1).checked = false;
		});
	});
	
	$('#register_reset').click(function(){
		$('#dialog_login input').val('');
	});
	
	$('#dialog_login').keypress(function(e){
		code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			if(hide_register){
				$('#login').focus();
				$('#login').trigger('click');
			}
			else{
				$('#register').focus();
				$('#register').trigger('click');
			}
		}
	});
	
	$('#login').click(loginAction);
	
	$('#login_register').click(loginRegisterAction);
		
	$('#register').click(function(){
		if(CheckRegisterInfo(
				$('#acc').val(),
				$('#pwd').val(),
				$('#check_pwd').val(),
				$('#first_name').val(),
				$('#last_name').val(),
				$('#mail').val(),
				$('#gender').val())){

			$.ajax({
				url: 'php/register.php',
				cache: false,
				dataType: 'html',
				type:'POST',
				data: { 
					acc: $('#acc').val(),
					pwd: $('#pwd').val(),
					first_name: $('#first_name').val(),
					last_name: $('#last_name').val(),
					mail: $('#mail').val(),
					gender: ($('input[name=gender]:checked').val() == "male")? 1: 0
				},
				error: function(xhr) {
					alert('網路連線錯誤，請稍後再試');
				},
				success: function(response) {
					if(response.trim() == "success"){
						$('#hint').css('color', '#00FA03');
						$('#dialog_login input').val('');
						alert('申請帳號成功! 請重新登入!');
						$('#login_register').trigger('click');
					}
					else if(response.trim() == "used"){
						$('#hint').css('color', '#00FA03');
						$('#hint').text('此帳號已被申請');
					}
					else{
						$('#hint').css('color', 'red');
						$('#hint').text('申請帳號失敗! 請稍後再次嘗試!');
					}
				}
			});
		}
	});
	
	$('#create_create').click(function(){
		var today=new Date()
		var year=today.getYear();
		var month=today.getMonth()+1;
		var date=today.getDate();
		var hour=today.getHours();
		var minute=today.getMinutes();
		var second=today.getSeconds();
		
		if(CheckPlanInfo()){
			var pageData = { 
				secret: window.sessionStorage["secret"],
				name: $('#create_name').val(),
				content: $('#create_content').val(),
				start: $('#create_start').val(),
				end: $('#create_end').val(),
				now: $('#create_start').val(),
				unit: $('#create_unit').val(),
				deadline: $('#create_deadDate').val() + ' ' + $('#create_deadTime').val()
			};
			
			$.ajax({
				url: 'php/createPlan.php',
				cache: false,
				dataType: 'html',
				type:'POST',
				data: pageData,
				error: function(xhr) {
					alert('網路連線錯誤，請稍後再試');
				},
				success: function(response) {
					AddPage(pageData);

					$('<li>' + pageData['name'] + '</li>').appendTo($('#list_plans')).bind({
						mouseenter: function(){
							$(this).css('color', 'yellow');
							$(this).css('cursor', 'pointer');
						},
						mouseleave: function(){
							$(this).css('color', 'brown');
						}
					}).click(function(){
						TurnToPage($('#aside_contents li').size() + 1);
					});
					$('#page_create input').val('');
					$('#book').bookblock();
					$('#book').bookblock('last');
				}
			});
		}
	});
	
	$(document).ajaxStart(function(){
		Loading();
	});
	$(document).ajaxComplete(function(){
		Loaded();
	});
	
	$('#create_back').click(function(){
		$('#page_create input').val('');
	});
	

});

var initialCSS = function(){
	var h = $(document).height();
    var w = $(document).width();
	
	AdjustBookSize();
	
} 

var AdjustBookSize = function(){
	var h = $(document).height();
    var w = $(document).width();

    if(w <= 1200){
		$('#book').css('left', (w-$('#book').width())/2);
    	$('aside').css('right', -$('#aside_contents').width());
		
		hide_aside = false;
    }
	else{
		$('#book').css('left', (w-$('#aside_contents').width()-$('#book').width())/2);
		$('aside').css('right', 0);
		hide_aside = true;
	}
	
	$('#book-base').css('width',$('#book').width()+136);
	$('#book-base').css('height',$('#book').height()+100);
	$('#book-base').css('left',$('#book').position().left-76);
	$('#book-base').css('top',$('#book').position().top);

	$('#loading').css('top', (h - $('#loading').height())/2);
	$('#loading').css('left', (w - $('#loading').width())/2);
	
	$('aside').css('height', (h - $('.ui.inverted.menu').height()) * 0.9);
	$('aside').css('marginTop', h*0.05 + $('.ui.inverted.menu').height()*0.95); 
}

var CheckAcc = function(acc){ 
	if(acc.trim() == ""){
		$('#hint').text('請輸入帳號');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(acc.length < 6 || acc.length > 20){
		$('#hint').text('帳號須為6到20個字元');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
}

var CheckPwd = function(pwd, chk_pwd){ 
	if(pwd.trim() == ""){
		$('#hint').text('請輸入密碼');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(pwd.length < 6 || pwd.length > 20){
		$('#hint').text('密碼須為6到20個字元');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(chk_pwd != pwd){
		$('#hint').text('兩次輸入密碼不相同');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
}

var CheckOther = function(first_name, last_name, mail, gender){
	if(first_name.trim() == ""){
		$('#hint').text('請輸入姓氏');
		$('#hint').css('color', 'red');
		return false;
	}
	else if(first_name.length > 20){
		$('#hint').text('姓氏不得超過20字元');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(last_name.trim() == ""){
		$('#hint').text('請輸入名字');
		$('#hint').css('color', 'red');
		return false;
	}
	else if(last_name.length > 20){
		$('#hint').text('名字不得超過20字元');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(mail.trim() == ""){
		$('#hint').text('請輸入信箱');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
}

var CheckRegisterInfo = function(acc, pwd, chk_pwd, first, last, mail, male){
	return (CheckAcc(acc) 
			&& CheckPwd(pwd, chk_pwd) 
			&& CheckOther(first, last, mail, male));
}

var LoadPlans = function(secret){
	$.ajax({
		url: 'php/loadPlans.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			secret: secret
		},
		error: function(xhr) {
			return false;
		},
		success: function(response) {
			var data = $.parseJSON(response);

			for(var k in data){
				$('#list_plans').append('<li>' + data[k]['name'] + '</li>');
				AddPage(data[k]);
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
					TurnToPage(i+2);
				});
			});
			
			$('#new_plan').click(function(){
				TurnToPage(1);
			});
			
			$('#book').bookblock();
		}
	});
}

var AddPage = function(data){
	var s = parseInt(data['start']), e = parseInt(data['end']), n = parseInt(data['now']), u = data['unit'];	
	var done = (n-s)/(e-s);
	
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	if(s > e)
		page = $('<form oninput="amount.value='+s+'-parseInt(rangeInput.value)+'+e+';"></form>').appendTo(page);
	else
		page = $('<form oninput="amount.value=parseInt(rangeInput.value);"></form>').appendTo(page);
	
	var page_left = $('<div class="page_left"></div>').appendTo(page);
	var page_right = $('<div class="page_right"></div>').appendTo(page);
	
	page_left.append('<div class="page_title"><h3>' + data['name'] +'</h3></div>');
	

	if(s > e){
		page_right.append(	'<div class="page_progressTitle">增進你的進度吧!</div>'+
							'<div class="page_progress">'+
								'<output id="page_now" name="amount" class="rangeOutput" for="rangeInput">'+n+'</output> / '+e+' '+u+
								'<input type="range" class="rangeInput" name="rangeInput" min="'+e+'" max="'+s+'" value="'+(s-n+e)+'"/><br/>' +
								s+'　　　　　　　　　　　'+e+
							'</div>');
	}
	else{
		page_right.append(	'<div class="page_progressTitle">增進你的進度吧!</div>'+
							'<div class="page_progress">'+
								'<output id="page_now" name="amount" class="rangeOutput" for="rangeInput">'+n+'</output> / '+e+' '+u+
								'<input type="range" class="rangeInput" name="rangeInput" min="'+s+'" max="'+e+'" value="'+n+'"/><br/>' +
								s+'　　　　　　　　　　　'+e+
							'</div>');
	}
	
	var div_button = $('<div id="button"></div>').appendTo(page_right);				  
	var button_save = $('<a href="#" class="save">Save<span></span></a>').appendTo(div_button);
	
	page_right.append('<div class="page_diary">心情小記</div>');
	page_right.append('<textarea class="page_diaryContent">' + data['content'] + '</textarea>');	
	
	var now = new Date();
	var expire = new Date(data['deadline']);
	
	if(expire.valueOf() < now.valueOf())
		page_left.append('<div class="page_timer">Time : 已過期</div>');
	else{
		var diff = new Date(expire - now);
		page_left.append('<div class="page_timer">距離期限還有 ' + ((diff.getDate())? diff.getDate() + ' 日 ':'') + diff.getUTCHours() + ' 時 ' + diff.getUTCMinutes() + ' 分</div>');
	}
	var game = $('<div class="page_gameContent"></div>').appendTo(page_left);

	game.append('<img src="img/bug.png" />');
	game.append('<div class="bubble"></div>');
	game.append('<div class="WoodBoard"></div>');
	page_left.append('<div class="page_status"><output name="percentage" class="page_percentage">'+100*(n-s)/(e-s)+'</output>'+' %</div>');
	page_right.append('<div class="page_bean"></div>');

	moveBug(game, done);
	
	button_save.click(function(){
		var pageData = { 
			id: data['id'],
			now: $(this).parents('form').children('.page_right').children('.page_progress').children('#page_now').val(),
			content: $(this).parents('form').children('.page_right').children('.page_diaryContent').val()
		};
		
		$.ajax({
			url: 'php/updatePlan.php',
			cache: false,
			dataType: 'html',
			type:'POST',
			data: pageData,
			error: function(xhr) {
				alert('網路連線錯誤，請稍後再試');
			},
			success: function(response) {
				done = (pageData['now']-s)/(e-s);
				//alert(response + '資料已更新');
				//alert('資料已更新');
				//alert($(this).text());
				button_save.parents('form').children('.page_left').children('.page_status').children('.page_percentage').val(100*done);
				moveBug(game, done);
			}
		});
	});
	
}

var TurnToPage = function(page){
	$('#book').bookblock('jump', page, 100);
}

var WriteCookie = function(secret){
	window.localStorage["secret"] = secret;
}

var ClearCookie = function(){
	window.localStorage["secret"] = "";
	window.sessionStorage["secret"] = "";
}

var LoadCookie = function(){
	return window.localStorage["secret"];
}

var Loading = function(){
	$('#mask').show();
	$('#loading').animateImages('img/loading/loading_@.png', 5, 300);
	
	var h = $(document).height();
    var w = $(document).width();
	$('#loading').css('top', (h - $('#loading').height())/2);
	$('#loading').css('left', (w - $('#loading').width())/2);
}

var Loaded = function(){
	$('#loading').empty();
	$('#mask').hide();
}

var CheckPlanInfo = function(){
	var msg = "";
	if($('#create_name').val().trim() == ""){
		msg += "\n計畫名稱";
	}
	if($('#create_unit').val().trim() == ""){
		msg += "\n單位";
	}
	if($('#create_start').val().trim() == ""){
		msg += "\n起始値(你現在的狀況)";
	}
	if($('#create_end').val().trim() == ""){
		msg += "\n終點值(你的最終目標)";
	}
	if($('#create_deadDate').val().trim() == ""){
		msg += "\n截止日期";
	}
	if($('#create_deadTime').val().trim() == ""){
		msg += "\n截止時間";
	}
	if(msg != ""){
		msg = "請設定\n" + msg;
		alert(msg);
		return false;
	}
	else{
		var expire = new Date($('#create_deadDate').val().trim() + " " + $('#create_deadTime').val().trim());
		var now = new Date();
		if(expire.valueOf() < now.valueOf()){
			alert("結束時間不可早於現在時間喔!!!!!");
			return false;
		}
	}
	return true;
}

var loginAction = function(){
	if($('#rem').prop('checked') && !navigator.cookieEnabled){
		alert('需先開啟瀏覽器cookie功能');
		return;
	}
	$.ajax({
		url: 'php/login.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			acc: $('#acc').val(),
			pwd: $('#pwd').val()
		},
		error: function(xhr) {
			alert("網路出現問題，請稍候再試!!");
		},
		success: function(response) {
			var data = $.parseJSON(response);
			if(data['msg'] == "success"){
				$("#login").unbind("click");
				$("#login_register").unbind("click");
				
				first_name = data['first_name'];
				last_name = data['last_name'];
				secret = data['secret'];
				$('#menu_user').text(first_name+last_name);
				
				LoadPlans(secret);
				
				window.sessionStorage["secret"] = secret;
				if($('#rem').prop('checked'))
					WriteCookie(secret);

				$('#cover_lock').animate({transform: 'rotate(1080deg)'}, 2000, function(){
					$('.unauth').fadeOut(1000, function(){
						
						$("#login").bind("click", loginAction);
						$('#login_register').bind("click", loginRegisterAction);
						
						$('#acc').val('');
						$('#pwd').val('');
						$(".auth").fadeIn(1000);
						AdjustBookSize();
						$('#cover_lock').animate({transform: 'rotate(0deg)'});
						$('#mask').hide();
					});
				});
			}
			else{
				$('#unauth').effect('shake');
			}
		}
	});
}

var loginRegisterAction = function(){
	$('.info_login').slideToggle('slow');
	$('.info_register').slideToggle('slow');
	if(hide_register){
		$(this).text('回登入畫面');
		$('#hint').css('color', 'white');
		$('#hint').text('請輸入以下資料');
	}
	else{
		$(this).text('註冊');
		$('#hint').css('color', 'white');
		$('#hint').text('請輸入帳號密碼');
	}
	hide_register = !hide_register;
}

var moveBug = function(gameContent, done){
	var	bubble = [[-100, 210],[20, 10]];
	var bug = [[90, 240], [220, 20]];
	var talk = [	"快開始進度吧！",
					"才完成10%左右，再加油一點好嗎?",
					"才完成1/5，還有很大的進步空間!!", 
					"30%了~~ 再接再厲 > <", 
					"40%囉！快過半了～", 
					"已經達成一半囉！加油加油～", 
					"及格邊緣！～", 
					"七成了喔！再加把勁～", 
					"完成八成了！加倍努力完成它吧！", 
					"九成囉～成功就在不遠處！", 
					"恭喜你完成囉!!"];
	var choice = parseInt(done * 10);
	
	var bubble_top = (bubble[1][0] - bubble[0][0])*done + bubble[0][0];
	var bubble_left = (bubble[1][1] - bubble[0][1])*done + bubble[0][1];
	var bug_top = (bug[1][0] - bug[0][0])*done + bug[0][0];
	var bug_left = (bug[1][1] - bug[0][1])*done + bug[0][1];

	gameContent.children('img').animate({top: bug_top, left: bug_left}, 1000);
	gameContent.children('.bubble').animate({top: bubble_top, left: bubble_left}, 1000);
	gameContent.children('.bubble').text(talk[choice]);
}