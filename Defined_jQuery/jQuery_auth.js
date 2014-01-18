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
	
		
	$('#menu_logout').click(function(){
		ClearCookie();
		location.reload();
	});
	
});

var display_auth = function(){
	var h = $(window).height();
    var w = $(window).width();

    if(w <= 1200){
		$('#book').css('left', (w-$('#book').width())/2);
    	$('aside').css('right', 0);
		$('aside').css('top',460);
		hide_aside = true;
    }
	else{
		$('#book').css('left', (w-$('#aside_contents').width()-$('#book').width())/2);
		$('aside').css('right', 100);
		$('aside').css('top',50);
		hide_aside = false;
	}
	
	$('#book-base').css('width',$('#book').width()+115);
	$('#book-base').css('height',$('#book').height()+120);
	$('#book-base').css('left',$('#book').position().left-46);
	$('#book-base').css('top',$('#book').position().top-20);

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
			$('#book').children().remove();
			$('#list_plans').empty();
			
			if(pages.length)
				pages.length = 0;
			pages.push(AddCreatePage());
			
			var planPacket = $.parseJSON(response);

			for(var i in planPacket){
				var planData = $.parseJSON(planPacket[i]);
				$('#list_plans').append('<li>' + planData['name'] + '</li>');
				pages.push(AddPlanPage1(planData, true));
				pages.push(AddPlanPage2(planData, true));
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
			display_auth();
		}
	});
}

var AddCreatePage = function(){
	var page = $('<div class="bb-item" id="page_create">\
					<div class="page_left">\
						<div class="create_title">創建新計畫</div>\
						<div class="create_profile_pic"></div>\
						<input type="text" id="create_name" placeholder="輸入計畫名稱"/>\
						<div class="create_goal">\
							<div class="create_goal_text">設定目標</div>\
							<input type="text" id="create_start" placeholder="初始値"/>\
							<input type="text" id="create_unit" placeholder="單位"/>\
							<input type="text" id="create_end" placeholder="目標値"/>\
						</div>\
						<div class="create_deadline">\
							<div class="create_goal_text">設定期限</div>\
							<input type="text" id="create_deadDate" placeholder="日期"/><input type="text" id="create_deadTime" placeholder="時間" />\
						</div>\
					</div>\
					<div class="page_right">\
						<div id="create_task">\
							<input type="text" id="create_newTask" placeholder="輸入待辦事項">\
							<div id="create_addNewTask"></div>\
							<div id="create_task_list">\
								<label onclick="checkboxToggle(this)" class="create_task_item">\
									<input type="checkbox" class="checkbox"/>\
									<span></span><div class="create_task_content">範例</div>\
									<div class="create_task_delete"></div>\
								</label>\
							</div>\
						</div>\
						<div class="button">\
							<a href="#" class="back" id="create_back">Back<span></span></a>\
							<a href="#" class="create" id="create_create">Create<span></span></a>\
						</div>\
					</div>\
				</div>').appendTo($('#book'));
				$('.create_task_delete').click(function(){
					$(this).parent().remove();
				});
	$(function(){
		$("#create_deadDate").datepicker({dateFormat: 'yy-mm-dd'});
	}); 
	$(function(){
		$("#create_deadTime").timepicker({timeFormat: 'HH:mm:ss'});
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
					pages.push(AddPlanPage1(pageData, true));
					pages.push(AddPlanPage2(pageData, true));
					
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
						TurnToPage(pages.length - 1);
					});
					$('#page_create input').val('');
					$('#book').bookblock();
					TurnToPage(pages.length - 1);
				}
			});
		}
	});
	
	$('#create_back').click(function(){
		$('#page_create input').val('');
	});
	
	$("#create_addNewTask").click(function() {
		$itemValue = $('#create_newTask').val();
		$num = $('.create_task_item').length + 1;
		$checkboxID = 'checkbox'.concat($num.toString());
		if($itemValue != "") {
			var task = $('<label onclick="checkboxToggle(this)" class="create_task_item">\
							<input type="checkbox" class="checkbox"/>\
							<span></span><div class="create_task_content">'+$itemValue+'</div>\
						</label>').appendTo($('#create_task_list'));
			var btn_delete = $('<div class="create_task_delete"></div>').appendTo(task);
			btn_delete.click(function(){
				$(this).parent().remove();
			});
			$('#create_newTask').val("");
			$('#create_task_list').scrollTop($('#create_task_list').prop('scrollHeight'));
		}
	}); 
	
	return page;
}

var AddPlanPage2 = function(data, personal){
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	var plan_left = $('<div class="page_left"></div>').appendTo(page);
	var plan_right = $('<div class="page_right"></div>').appendTo(page);
	
	plan_left.append('<div class="plan_prev"></div>');
	plan_left.children('.plan_prev').click(function(){
		$('#book').bookblock('prev');
	});
	
	plan_right.append('<div class="ui comments">\
						<div id="comment_content" style="overflow-y: auto; height: 80%;"></div>\
						<form class="ui reply form" style="position:absolute; bottom:10px; width: 90%; margin: 0 auto;">\
							<div class="field" syle="width: 90%;">\
								<textarea id="input_comment" name="input_comment" style="min-height:40px; height: 40px; padding: 5px;"></textarea>\
							</div>\
							<div class="ui button teal submit labeled icon" style="float:right; margin-right: 20px;" id="add_comment">\
								<i class="icon edit"></i> Add Comment\
							</div>\
						</form>\
					</div>');
	var form = plan_right.children().children('form');
	var input = form.children('.field').children('#input_comment');
	var content = form.parent().children("#comment_content");	
	if(data['comment']){
		var comment = $.parseJSON(data['comment']);
		for(var i in comment){
			if(comment[i]){
				comData = $.parseJSON(comment[i]);
				content.append(
					'<div class="comment">\
						<div class="content">\
							<a class="author">'
							+ comData['user_name'] +
							'</a>\
							<div class="text">'
							+ comData['content']+
							'</div>\
						</div>\
					</div>');
			}
		}			
	}
	form.children('#add_comment').click(function(){
		var comment = input.val();
		// uer name
		if(comment != "") {
			var pageData = { 
				plan_id: data['id'],
				content: comment,
				secret: window.sessionStorage["secret"]
			};
			
			$.ajax({
				url: 'php/updateComment.php',
				cache: false,
				dataType: 'html',
				type:'POST',
				data: pageData,
				error: function(xhr) {
					alert('Network is wrong');
				},
				success: function(response) {
					var username = response.trim();
					content.append(
						'<div class="comment">\
							<div class="content">\
								<a class="author">'
								+ username +
								'</a>\
								<div class="text">'
								+ comment+
								'</div>\
							</div>\
						</div>');
						content.scrollTop(content.prop("scrollHeight"));
						input.val('').keydown();
				}
			});
		
			
		} else {
			//alert("data = null");
		}
	});

	input.css("overflow","hidden").bind("keydown keyup", function(){  
        $(this).height('0px').height($(this).prop("scrollHeight")+"px");
		content.height((plan_right.height()*0.8 - $(this).height()) + "px");
		content.scrollTop(content.prop("scrollHeight"));
    }).keydown();
	
	content.height(356);
	
	return page;
}

var AddPlanPage1 = function(data, personal){

	var s = parseInt(data['start']), e = parseInt(data['end']), n = parseInt(data['now']), u = data['unit'];	
	if(s > e){
		var temp = s;
		s = e;
		e = temp;
	}
	var done = (n-s)/(e-s);
	
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	var plan_left = $('<div class="page_left"></div>').appendTo(page);
	var plan_right = $('<div class="page_right"></div>').appendTo(page);
	
	plan_left.append('<div class="plan_title"><h3>' + data['name'] +'</h3></div>');
	
	var game = $('<div class="plan_gameContent"></div>').appendTo(plan_left);

	game.append('<div class="game_bean"></div>');
	game.append('<div class="game_ropeX"></div>');
	game.append('<div class="game_beltSystem"></div>');
	game.append('<div class="game_ropeY"></div>');
	game.append('<div class="game_bug"></div>');
	game.append('<div class="game_bicycle"></div>');
	game.append('<div class="game_container"></div>');

	var progress_frame = $('<div class="plan_progress"></div>').appendTo(plan_right);
	var clock = $('<div class="plan_clock"></div>').appendTo(progress_frame);
	
	clock.hover(
		function(){
			var now = new Date();
			var t1 = expire.getTime();
			var t2 = now.getTime();
			var str = '';
			
			if(t1 > t2){
				var dis = t1 - t2;
				dis = parseInt(dis/1000);
				if(dis)	str = (dis%60)+' 秒 ';
				dis = parseInt(dis/60);
				if(dis)	str = (dis%60)+' 分 ' + str;
				dis = parseInt(dis/60);
				if(dis)	str = (dis%24)+' 小時 ' + str;
				dis = parseInt(dis/24);
				if(dis)	str = (dis%365)+' 日 ' + str;
				dis = parseInt(dis/365);
				if(dis)	str = (dis)+' 年 ' + str;
			}
			else{
				str = '已過期';
			}
			plan_right.children('.plan_time').text(str);
			plan_right.children('.plan_time').css('display', 'block');
		},
		function(){
			plan_right.children('.plan_time').css('display', 'none');
		}
	);

	progress_frame.append('<div class="plan_progressscale"></div>');
	progress_frame.append('<div class="plan_max">'+data['end']+'<br/>'+data['unit']+'</div>');
	progress_frame.append('<div class="plan_min">'+data['start']+'<br/>'+data['unit']+'</div>');
	progress_frame.append('<div class="plan_progressstem"></div>');
	progress_frame.append('<div class="plan_progressnow">'+n+'</div>');
	var bar = $(
		'<input type="range" class="plan_progressbar" name="plan_progressbar"\
			min="'+s+'" max="'+e+'" value="'+n+'"/>').appendTo(progress_frame);
	bar.change(function(){
		progress_frame.children('.plan_progressnow').css(
			'bottom',
			245*($(this).val()-s)/(e-s)+140
		);
		progress_frame.children('.plan_progressnow').text($(this).val());
		progress_frame.children('.plan_progressstem').css(
			'height',
			245*($(this).val()-s)/(e-s)
		);
	});
	
	progress_frame.children('.plan_progressstem').css(
		'height',
		245*done-3
	);
	progress_frame.append('<div class="plan_progressbean"></div>');
	
	
	var task_frame = $(	
		'<div class="plan_task">\
			<input type="text" class="plan_newTask" placeholder="輸入待辦事項">\
			<div class="plan_addNewTask"></div>\
			<div class="plan_task_list"></div>\
		</div>').appendTo(plan_right);				
						
	task_frame.children('.plan_addNewTask').click(function(){
		var itemValue = task_frame.children('.plan_newTask').val();
		var num = task_frame.children('.plan_task_item').length + 1;
		var checkboxID = 'checkbox'.concat(num.toString());
		if(itemValue != "") {
			var task = $('<label onclick="checkboxToggle(this)" class="plan_task_item">\
							<input type="checkbox" class="checkbox"/>\
							<span></span><div class="plan_task_content">'+itemValue+'</div>\
						</label>').appendTo(task_frame.children('.plan_task_list'));
			var btn_delete = $('<div class="plan_task_delete"></div>').appendTo(task);
			btn_delete.click(function(){
				$(this).parent().remove();
			});
			task_frame.children('.plan_newTask').val('');
			task_frame.children('.plan_task_list').scrollTop($(this).children(".plan_task_list").prop("scrollHeight"));
		}
	}); 
	
	plan_right.append('<div class="plan_next"></div>');
	plan_right.children('.plan_next').click(function(){
		$('#book').bookblock('next');
	});
	var div_button;

	if(personal){
		div_button = $('<div class="button"></div>').appendTo(plan_right);		
	}
	else{
		plan_right.find('input').attr('disabled', 'disabled');
		plan_right.find('textarea').attr('disabled', 'disabled');
	}
	
	var now = new Date();
	var expire = new Date(data['deadline']);
	var t1 = expire.getTime();
	var t2 = now.getTime();
	
	if(t1 < t2){
		plan_right.prepend('<div class="plan_time">已過期</div>');
		plan_right.find('input').attr('disabled', 'disabled');
		plan_right.find('textarea').attr('disabled', 'disabled');
		return;
	}
	
	var dis = t1 - t2;
	
	var str = '';
	dis = parseInt(dis/1000);
	if(dis)	str = (dis%60)+' 秒 ';
	dis = parseInt(dis/60);
	if(dis)	str = (dis%60)+' 分 ' + str;
	dis = parseInt(dis/60);
	if(dis)	str = (dis%24)+' 小時 ' + str;
	dis = parseInt(dis/24);
	if(dis)	str = (dis%365)+' 日 ' + str;
	dis = parseInt(dis/365);
	if(dis)	str = (dis)+' 年 ' + str;
	plan_right.prepend('<div class="plan_time">剩餘 '+str+'</div>');
	
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
/*
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
}*/