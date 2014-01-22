/*------Initialization------*/
$(document).ready(function(){	
	display_unauth();
});

/*------Event Handler------*/
$(document).ready(function(){	
	$(window).resize(function(){
		display_unauth();
	});
	
	
	
	/*---Dialog---*/
	$('#main_btn_login').click(function(){
		$('#unauth').show(1, function(){
			$('#dialog_login').show('bounce', {times: 1, distance: 30}, 500);
		});
	});
	
	$('#main_btn_register').click(function(){
		$('#unauth').show(1, function(){
			$('#dialog_register').show('bounce', {times: 1, distance: 30},  500);
		});
	});
	
	$('#login_back').click(function(){
		$('#dialog_login').hide('bounce', {times: 1, distance: 30}, 500, function(){
			$('#unauth').hide(1);
		});
	});
	
	$('#register_back').click(function(){
		$('#dialog_register').hide('bounce', {times: 1, distance: 30}, 500, function(){
			$('#unauth').hide(1);
		});
	});
	
	$('.loginButton.radio').each(function(i){
		$(this).click(function(){
			$(':radio').get(i).checked = true;
			$(':radio').get(i-1).checked = false;
		});
	});
	
	$('#register_reset').click(function(){
		$('#dialog_register input').val('');
	});
	
	$('#dialog_login').keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			$('#login').focus();
			$('#login').trigger('click');
		}
	});
	
	$('#dialog_register').keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			$('#register').focus();
			$('#register').trigger('click');
		}
	});
	
	/*---Register & Login Action---*/
	$('#login').click(loginAction);
	$('#register').click(registerAction);
});

/*------Adjust some width & height------*/
var display_unauth = function(){
	var h_bg = parseInt(480);
	var w_bg = parseInt(640);
	
	var h_window = $(window).height();
	var w_window = $(window).width();
	
	//$('header').css('top', parseInt((h_window-h_bg)*0.15))
	
	$('#main_middle').css('height', h_bg);
	$('#main_middle').css('background-size', w_bg + 'px 100%');
	if(h_window > h_bg){	
		$('#main_top').css('height', parseInt((h_window-h_bg)*0.3));
		$('#main_bottom').css('height', parseInt((h_window-h_bg)*0.7) + 1);
	}
	else{
		$('#main_top').css('height', 0);
		$('#main_bottom').css('height', 0);
	}
	
	$('#main_logo').css('height', h_bg * 0.45);
	$('#main_logo').css('width', w_bg * 0.78);
	$('#main_logo').css('top', h_bg * 0.1);
	
	//$('#main_btn_login').css('top', h_bg * 0.13);
	//$('#main_btn_register').css('top', h_bg * 0.15);
	
	$('#dialog_login').css('top', 0.5 * (h_window - $('#dialog_login').height()));
	$('#dialog_register').css('top', 0.5 * (h_window - $('#dialog_register').height()));
}

var loginAction = function(){
	if($('#rem').prop('checked') && !navigator.cookieEnabled){
		alert('Please turn on the function of cookie!');
		return;
	}
	$.ajax({
		url: 'php/login.php',
		cache: false,
		dataType: 'html',
		type:'POST',
		data: { 
			acc: $('#dialog_login .acc').val(),
			pwd: $('#dialog_login .pwd').val()
		},
		error: function(xhr) {
			alert('Network is wrong!');
		},
		success: function(response) {
			var data = $.parseJSON(response);
			if(data['msg'] == "success"){
				first_name = data['first_name'];
				last_name = data['last_name'];
				secret = data['secret'];
				
				LoadPlans(secret);
				
				window.sessionStorage["secret"] = secret;
				if($('#rem').prop('checked'))
					WriteCookie(secret);

				$('.unauth, #unauth').fadeOut(1000, function(){
					$('#dialog_login .acc').val('');
					$('#dialog_login .pwd').val('');
					display_auth();
					$('#auth, .auth').fadeIn(1000);
					$('#aside_picture').addClass(((parseInt(data['male']))? 'boy':'girl'));
				});
			}
			else{
				$('#dialog_login').effect('shake');
			}
		}
	});
}

var registerAction = function(){
	if(CheckRegisterInfo(
			$('#dialog_register .acc').val(),
			$('#dialog_register .pwd').val(),
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
				acc: $('#dialog_register .acc').val(),
				pwd: $('#dialog_register .pwd').val(),
				first_name: $('#first_name').val(),
				last_name: $('#last_name').val(),
				mail: $('#mail').val(),
				gender: ($('input[name=gender]:checked').val() == "male")? 1: 0
			},
			error: function(xhr) {
				alert('Network is wrong!');
			},
			success: function(response) {
				if(response.trim() == "success"){
					$('#hint').css('color', '#00FA03');
					$('#dialog_register input').val('');
					alert('註冊成功!');
					$('#register_back').trigger('click', function(){
						$('#main_btn_login').trigger('click');
					});
				}
				else if(response.trim() == "used"){
					$('#hint').css('color', '#00FA03');
					$('#hint').text('The account is used!');
				}
				else{
					$('#hint').css('color', 'red');
					$('#hint').text('Registration failed!');
				}
			}
		});
	}
}

var CheckRegisterInfo = function(acc, pwd, chk_pwd, first, last, mail, male){
	return (CheckAcc(acc) 
			&& CheckPwd(pwd, chk_pwd) 
			&& CheckOther(first, last, mail, male));
}

var CheckAcc = function(acc){ 
	if(acc.trim() == ""){
		$('#hint').text('Please enter your account!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(acc.length < 6 || acc.length > 20){
		$('#hint').text('An account must between 6 to 20 letters!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
}

var CheckPwd = function(pwd, chk_pwd){ 
	if(pwd.trim() == ""){
		$('#hint').text('Please enter your password!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(pwd.length < 6 || pwd.length > 20){
		$('#hint').text('A password must between 6 to 20 letters!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(chk_pwd != pwd){
		$('#hint').text('The passwords aren\'t the same');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
}

var CheckOther = function(first_name, last_name, mail, gender){
	if(first_name.trim() == ""){
		$('#hint').text('Please enter your first name!');
		$('#hint').css('color', 'red');
		return false;
	}
	else if(first_name.length > 20){
		$('#hint').text('Your first name is too long!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(last_name.trim() == ""){
		$('#hint').text('Please enter your last name!');
		$('#hint').css('color', 'red');
		return false;
	}
	else if(last_name.length > 20){
		$('#hint').text('Your last name is too long!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	if(mail.trim() == ""){
		$('#hint').text('Please enter your email!');
		$('#hint').css('color', 'red');
		return false;
	}
	
	return true;
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
