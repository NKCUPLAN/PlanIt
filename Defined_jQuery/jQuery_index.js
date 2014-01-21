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
				
				$('#aside_picture').addClass(((parseInt(data['male']))? 'boy':'girl'));
				LoadPlans(secret);
			}
			else{
				$('.unauth').fadeIn(1000);
			}
		}
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