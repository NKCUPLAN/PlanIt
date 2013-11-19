var hide_aside;
var hide_dialog_login = true;
var hide_register = true;

var first_name, last_name;

var cur_page = 1;

$(document).ready(function(){
	initialCSS();

	$.ajax({
		url: 'php/loginAuto.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			secret: LoadCookie()
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
	
	$('#login').click(function(){
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
					first_name = data['first_name'];
					last_name = data['last_name'];
					secret = data['secret'];
					
					if($('#rem').prop('checked'))
						WriteCookie(secret);
					else
						ClearCookie();

					LoadPlans(secret);
					$('#cover_lock').animate({transform: 'rotate(1080deg)'}, 2000, function(){
						$('.unauth').fadeOut(1000, function(){
							$('#acc').val('');
							$('#pwd').val('');
							$(".auth").fadeIn(1000);
							AdjustBookSize();
						});
					});
				}
				else{
					$('#unauth').effect('shake');
				}
			}
		});
	});
	
	$('#login_register').click(function(){
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
	});
		
	$('#register').click(function(){
		alert($('input[name=gender]:checked').val());
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
			},
			success: function(response) {
				if(response.trim() == "success"){
					$('#hint').css('color', '#00FA03');
					$('#dialog_login input').val('');
					alert('申請帳號成功! 請重新登入!');
					$('#login_register').trigger('click');
				}
				else{
					$('#hint').css('color', 'red');
					$('#hint').text('申請帳號失敗! 請稍後再次嘗試!');
				}
				
			}
		});
		}
	});
	
});

var initialCSS = function(){
	var h = $(document).height();
    var w = $(document).width();
    
    $('aside').css('marginTop', h * 0.05); 
	
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
	
	return $.ajax({
		url: 'php/checkAccount.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			acc: $('#acc').val()
		},
		error: function(xhr) {
		},
		success: function(response) {
			if(response.trim() == "used"){
				$('#hint').text('此帳號已被申請');
				$('#hint').css('color', 'red');
				return false;
			}
			return true;
		}
	});
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
		},
		success: function(response) {
			var data = $.parseJSON(response);

			for(var k in data){
				$('#list_plans').append('<li>' + data[k]['name'] + '</li>');
				AddPage(data[k]);
			}
			
			$('#book').bookblock();
			
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
		}
	});
}

var AddPage = function(data){
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	
	var left = $('<div class="page_left"></div>').appendTo(page);
	var right = $('<div class="page_right"></div>').appendTo(page);
	
	left.append('<div class="title">' + data['name'] + '</div>');
	
}

var TurnToPage = function(page){
	if(cur_page != page){
		cur_page = page;
		$('#book').bookblock('jump', page);
		//$('#book-base')
		//	.animate({boxShadow: '0px 0px 40px rgba(255,255,51,0.9)'}, 500)
		//	.animate({boxShadow: '0px 0px 25px rgba(0,0,0,0.9)'}, 500);
	}
}

var WriteCookie = function(secret){
	var cookie = "planit=" + secret;
    var date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    var expirestr = date.toGMTString();
    cookie += "; expires=" + expirestr;
    document.cookie = cookie;
}

var ClearCookie = function(){
	var cookie = "planit=;";
	var date = new Date();
    date.setTime(date.getTime() - 1);
    var expirestr = date.toGMTString();
    cookie += "; expires=" + expirestr;
    document.cookie = cookie;
}

var LoadCookie = function(){
    if (document.cookie.length > 0){
        var c_list = document.cookie.split(";");
        for(i in c_list){
            var cook = c_list[i].split("=");
            if(cook[0] == "planit")
				return cook[1];
        }
    }
    return;
}
