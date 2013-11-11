var hide_aside;
var hide_dialog_login = true;
var hide_register = true;

var acc, pwd;
var first_name, last_name;

var current_page = 1;

$(document).ready(function(){
	initialCSS();
	
	//-----------------------------------------------------------header
	$('#menu_login').click(function(){
		if(hide_dialog_login){
        	$('#dialog_login').slideToggle('slow');
		}
        else{
        	$('#dialog_login').slideToggle('slow');
		}
        hide_dialog_login = !hide_dialog_login;
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

	$('.loginButton.radio').each(function(i){
		$(this).click(function(){
			$(':radio').get(i).checked = true;
			$(':radio').get(i-1).checked = false;
		});
	});
	
	$('#reset').click(function(){
		$('#acc').val('');
		$('#pwd').val('');
	});	
	
	$('#register_reset').click(function(){
		$('#dialog_login input').val('');
	});
	
	$('#login').click(function(){
		acc = $('#acc').val();
		pwd = $('#pwd').val();
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
					
					LoadPlans();
					$('#dialog_login').stop().fadeOut(1000, function(){
						$('#lock').toggle('explode', 1000, function(){
							$('#cover').fadeOut(1000, function(){
								$('#book').fadeIn(1000);
								$('aside').fadeIn(1000);
							});
						});
					});	
				}
				else{
					$('article').effect('shake');
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
    	$('aside').css('right', -$('#aside_contents').width());
		hide_aside = false;
    }
	else{
		$('aside').css('right', 0);
		hide_aside = true;
	}
	
	$('#book').css('marginTop', 0.05 * h);
	$('#book').css('marginBottom', 0.05 * h);
	
	var book_h = h * 0.9;
		
	$('#book .page_title').css('height', h * 0.1);
	$('#book .page_title').css('line-height', h * 0.1 +'px');
	$('#book .page_update').css('height', h * 0.4);
	$('#book .page_statistic').css('height', h * 0.5);
	$('#book .page_game').css('height', h * 0.4);
	$('#book .page_diary').css('height', h * 0.5);
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

var LoadPlans = function(){
	$.ajax({
		url: 'php/loadPlans.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			acc: acc
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
					$('#book').bookblock('jump', i+2);
					$('#book')
						.animate({boxShadow: '0px 0px 40px rgba(255,255,51,0.9)'}, 500)
						.animate({boxShadow: '0px 0px 25px rgba(0,0,0,0.9)'}, 500);
				});
			});
			
			$('#new_plan').click(function(){
				$('#book').bookblock('first');
			});
			
			$('#createPlan .title').append('Welcome! ' + first_name + " " + last_name);
		}
	});
}

var AddPage = function(data){
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	
	var left = $('<div class="page_left"></div>').appendTo(page);
	var right = $('<div class="page_right"></div>').appendTo(page);
	
	left.append('<div class="title">' + data['name'] + '</div>');
	
}
