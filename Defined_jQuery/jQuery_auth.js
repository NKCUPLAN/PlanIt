var pages = new Array();

/*------Initialization------*/
$(document).ready(function(){	
	display_auth();
});

/*------Event Handler------*/
$(document).ready(function(){	
	$(window).resize(function(){
		display_auth();
	});

	/*------aside------*/
	$('#aside_switch').click(function(){
		var h = $(window).height();
		
    	if(hide_aside){
        	$('aside').animate(
            	{'top':  '50px'},
                600
            );
		}
        else{
        	$('aside').animate(
            	{'top': '460px'},
                600
            );
		}
        hide_aside = !hide_aside;
    });
	
	/*------BOOK_CREATE-------*/
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
					pageData['id'] = response.trim();
					pages.push(AddPlanPage1(pageData));

					var tag = $('<li>' + pageData['name'] + '</li>').appendTo($('#list_plans'));
					tag.bind({
						mouseenter: function(){
							$(this).css('color', 'yellow');
							$(this).css('cursor', 'pointer');
						},
						mouseleave: function(){
							$(this).css('color', 'brown');
						}
					});
					tag.click(function(){
						TurnToPage($('#aside_contents li').size() + 1);
					});
					$('#page_create input').val('');
					$('#book').bookblock();
					$('#book').bookblock('last');
				}
			});
		}
	});
	
	$('#create_back').click(function(){
		$('#page_create input').val('');
	});
	
	
});

var display_auth = function(){
	var h = $(window).height();
    var w = $(window).width();

    if(w <= 1200){
		$('#book').css('left', (w-$('#book').width())/2);
    	$('aside').css('right', 0);
		$('aside').css('top',460)
		hide_aside = true;
    }
	else{
		$('#book').css('left', (w-$('#aside_contents').width()-$('#book').width())/2);
		$('aside').css('right', 100);
		$('aside').css('top',50);
		hide_aside = false;
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
			if(pages.length)
				pages = pages.slice(0, 1);
			else 
				pages.push($('#page_create'));
			var data = $.parseJSON(response);

			for(var k in data){
				$('#list_plans').append('<li>' + data[k]['name'] + '</li>');
				pages.push(AddPlanPage1(data[k]));
				pages.push(AddPlanPage2(data[k]));
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
			
			$('#new_plan').click(function(){
				TurnToPage(1);
			});
			
			$('#book').bookblock();
		}
	});
}

var AddPlanPage2 = function(data){
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	
	return page;
}

var AddPlanPage1 = function(data){

	var now = new Date();
	var expire = new Date(data['deadline']);
	var t1 = expire.getTime();
	var t2 = now.getTime();
	
	var s = parseInt(data['start']), e = parseInt(data['end']), n = parseInt(data['now']), u = data['unit'];	
	var done = (n-s)/(e-s);
	
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	if(s > e)
		page = $('<form oninput="amount.value='+s+'-parseInt(rangeInput.value)+'+e+';"></form>').appendTo(page);
	else
		page = $('<form oninput="amount.value=parseInt(rangeInput.value);"></form>').appendTo(page);
	
	var plan_left = $('<div class="page_left"></div>').appendTo(page);
	var plan_right = $('<div class="page_right"></div>').appendTo(page);
	
	plan_left.append('<div class="plan_title"><h3>' + data['name'] +'</h3></div>');
	
	var game = $('<div class="plan_gameContent"></div>').appendTo(plan_left);

	game.append('<div class="game_bean"></div>');
	game.append('<div class="game_ropeX"></div>');
	game.append('<div class="game_beltSystem"></div>');
	game.append('<div class="game_container"></div>');
	game.append('<div class="game_ropeY"></div>');
	game.append('<div class="game_bug"></div>');
	game.append('<div class="game_bicycle"></div>');
	plan_right.append('<div class="plan_bean"></div>');
	moveBug(game, done);
	
	if(s > e){
		plan_right.append(	'<div class="plan_progressTitle">Update your plan any time!</div>'+
							'<div class="plan_progress"></br>'+
								'You are now <output id="plan_now" name="amount" class="rangeOutput" for="rangeInput">'+n+'</output> '+u+
								'<input type="range" class="rangeInput" name="rangeInput" min="'+e+'" max="'+s+'" value="'+(s-n+e)+'"/><br/>' +
								s+'　　　　　　　　　　　　'+e+
								'<br/><span style="font-size:14px">start</span>　　　　　　　　　　　　<span style="font-size:14px">end</span>'+
							'</div>');
	}
	else{
		plan_right.append(	'<div class="plan_progressTitle">Update your plan any time!</div>'+
							'<div class="plan_progress"></br>'+
								'You are now <output id="plan_now" name="amount" class="rangeOutput" for="rangeInput">'+n+'</output> '+u+
								'<input type="range" class="rangeInput" name="rangeInput" min="'+s+'" max="'+e+'" value="'+n+'"/><br/>' +
								s+'　　　　　　　　　　　　'+e+
								'<br/><span style="font-size:14px">start</span>　　　　　　　　　　　　<span style="font-size:14px">end</span>'+
							'</div>');
	}
	
	var div_button = $('<div id="button"></div>').appendTo(plan_right);	
	
	plan_right.append('<div class="plan_diary">Diary</div>');
	plan_right.append('<textarea class="plan_diaryContent">' + data['content'] + '</textarea>');	
	
	if(t1 < t2){
		plan_left.append('<div class="plan_timer">Time is up</div>');
		plan_right.find('input').attr('disabled', 'disabled');
		plan_right.find('textarea').attr('disabled', 'disabled');
		return;
	}
	
	var dis = t1 - t2;
	
	var str = '';
	dis = parseInt(dis/1000);
	//if(dis)	str += (dis%60)+' sec ';
	dis = parseInt(dis/60);
	if(dis)	str = (dis%60)+' min ' + str;
	dis = parseInt(dis/60);
	if(dis)	str = (dis%24)+' hour ' + str;
	dis = parseInt(dis/24);
	if(dis)	str = (dis%365)+' day ' + str;
	dis = parseInt(dis/365);
	if(dis)	str = (dis)+' year ' + str;
		
	plan_left.append('<div class="plan_timer">You have ' + str +' left!</div>');
	
	var button_save = $('<a href="#" class="save">Save<span></span></a>').appendTo(div_button);
	button_save.click(function(){
		var pageData = { 
			id: data['id'],
			now: $(this).parents('form').children('.plan_right').children('.plan_progress').children('#plan_now').val(),
			content: $(this).parents('form').children('.plan_right').children('.plan_diaryContent').val()
		};
		
		$.ajax({
			url: 'php/updatePlan.php',
			cache: false,
			dataType: 'html',
			type:'POST',
			data: pageData,
			error: function(xhr) {
				alert('Network is wrong');
			},
			success: function(response) {
				done = (pageData['now']-s)/(e-s);
				game.children('.WoodBoard').children('.plan_percentage').val(Math.round(1000*done)/10.0);
				moveBug(game, done);
			}
		});
	});
	return page;
}

var TurnToPage = function(page){
	$('#book').bookblock('jump', page, 100);
}

var CheckPlanInfo = function(){
	var msg = "";
	if($('#create_name').val().trim() == ""){
		msg += "\nPlan Name";
	}
	if($('#create_unit').val().trim() == ""){
		msg += "\nCalculating unit";
	}
	if($('#create_start').val().trim() == ""){
		msg += "\nStart value";
	}
	if($('#create_end').val().trim() == ""){
		msg += "\nEnd value";
	}
	if($('#create_deadDate').val().trim() == ""){
		msg += "\nThe Deadline Date";
	}
	if($('#create_deadTime').val().trim() == ""){
		msg += "\nThe Deadline Time";
	}
	if(msg != ""){
		msg = "Please enter\n" + msg;
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