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
            	{'top': '420px'},
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
		$('aside').css('top',420);
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
			$('#list_plans').append('<label><input type="checkbox"/>只顯示進行中計畫</label>');
			$('#list_plans').append('<div id="list_undone"></div>');
			$('#list_plans').append('<div id="list_done"></div>');

			if(pages.length)
				pages.length = 0;

			var planPacket = $.parseJSON(response);
			var undone = $.parseJSON(planPacket['undone']);
			var done = $.parseJSON(planPacket['done']);
			var user_info = $.parseJSON(planPacket['user_info']);
			
			pages.push(AddPersonalPage(user_info, true));
			pages.push(AddCreatePage());
			
			for(var i in undone){
				var planData = $.parseJSON(undone[i]);
				$('#list_undone').append('<li>' + planData['name'] + '</li>');
				pages.push(AddPlanPage1(planData, true));
				pages.push(AddPlanPage2(planData, true));
			}
			
			for(var i in done){
				var planData = $.parseJSON(done[i]);
				$('#list_done').append('<li>' + planData['name'] + '</li>');
				pages.push(AddPlanPage1(planData, true));
				pages.push(AddPlanPage2(planData, true));
			}
			
			$('#list_plans input[type=checkbox]').change(function(){
				$('#list_done').toggle(1);
			});
			
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
					TurnToPage(2*i+3);
				});
			});
			
			$('#new_plan').click(function(){
				TurnToPage(2);
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
			var taskData = new Array();
			$('.create_task_item').each(function(){
				taskData.push({
					content: $(this).children('.create_task_content').text(),
					done: $(this).children('input').prop('checked')
				});
			});

			var pageData = { 
				secret: window.sessionStorage["secret"],
				name: $('#create_name').val(),
				content: $('#create_content').val(),
				start: $('#create_start').val(),
				end: $('#create_end').val(),
				now: $('#create_start').val(),
				unit: $('#create_unit').val(),
				deadline: $('#create_deadDate').val() + ' ' + $('#create_deadTime').val(),
				taskData: taskData
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
					var data = $.parseJSON(response);
					pageData['id'] = data['plan_id'];
					pageData['task'] = data['task'];
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
	
	$('#create_task').keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			$('#create_addNewTask').trigger('click');
		}
	});
	
	return page;
}

var AddPersonalPage = function(data, personal){
	var page = $('<div class="bb-item" id="page_personal"></div>').appendTo($('#book'));
	var page_left = $('<div class="page_left"></div>').appendTo(page);
	var page_right = $('<div class="page_right"></div>').appendTo(page);

	//YOUR ADDED ITEM
	
	var id_card = $(
		'<div id="id_card"></div>\
		<div id="paper_clip"></div>\
		<div id="id_card_img"></div>\
		<div id="info_name" class="IDCard_content"><label>姓名: </label>'+data['first_name']+data['last_name']+'</div>\
		<div id="info_id" class="IDCard_content"><label>ID: </label>'+data['acc']+'</div>\
		<div id="info_gender" class="IDCard_content"><label>性別: </label>'+((parseInt(data['male']))? '男':'女')+'</div>\
		<div id="plan_count" class="IDCard_content"><label>完成計畫: </label><label>項</label></div>\
		<div id="info_mail" class="IDCard_content"><label>電子郵件: </label><br/>'+data['mail']+'</div>'
	).appendTo(page_left);
	
	page_right.append(
		'<div id="label_doing">\
			<img src="../PlanIt/img/info/plan_doing.png" alt="plan_doing" height="40" width="160">\
			<div class="content">\
				<ol>\
					<li>存錢</li>\
					<li>減肥</li>\
					<li>擺脫單身</li>\
				</ol>\
			</div>\
		</div>\
		<div id="label_done">\
			<img src="../PlanIt/img/info/plan_done.png" alt="plan_done" height="40" width="160">\
			<div class="content">\
				<ol>\
					<li>存錢</li>\
					<li>減肥</li>\
					<li>擺脫單身</li>\
				</ol>\
			</div>\
		</div>\
		<div id="label_undo">\
			<img src="../PlanIt/img/info/plan_undo.png" alt="plan_undo" height="40" width="160">\
			<div class="content">\
				<ol>\
					<li>存錢</li>\
					<li>減肥</li>\
					<li>擺脫單身</li>\
				</ol>\
			</div>\
		</div>');
	
	//-----------------------------
	return page;
}

var AddPlanPage1 = function(data, personal){
	var s = parseInt(data['start']), e = parseInt(data['end']), n = parseInt(data['now']), u = data['unit'];
	var reverse = (s > e);
	
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
	progress_frame.append('<div class="plan_progressleaf"></div>');
	
	if(!reverse){
		var bar = $(
			'<input type="range" class="plan_progressbar" name="plan_progressbar"\
				min="'+s+'" max="'+e+'" value="'+n+'"/>'
		).appendTo(progress_frame);
	}
	else{
		var bar = $(
			'<input type="range" class="plan_progressbar" name="plan_progressbar"\
				min="'+e+'" max="'+s+'" value="'+n+'"/>'
		).appendTo(progress_frame);
		bar.css('transform', 'rotate(90deg)');
	}
	progress_frame.append('<div class="plan_progressbean"></div>');
	
	bar.change(function(){
		progress_frame.children('.plan_progressnow').css(
			'bottom',
			238*($(this).val()-s)/(e-s)-250
		);
		progress_frame.children('.plan_progressnow').text($(this).val());
		progress_frame.children('.plan_progressleaf').css(
			'bottom',
			238*($(this).val()-s)/(e-s)-250
		);
		progress_frame.children('.plan_progressstem').css(
			'height',
			245*($(this).val()-s)/(e-s)
		);
	});
	bar.trigger('change');

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
	
	task_frame.keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			task_frame.children('.plan_addNewTask').trigger('click');
		}
	});

	if(data['task']){
		var tasks = $.parseJSON(data['task']);
		for(var i in tasks){
			if(tasks[i]){
				taskData = $.parseJSON(tasks[i]);
				$('<label onclick="checkboxToggle(this)" class="plan_task_item">\
					<input type="checkbox" class="checkbox"'+((parseInt(taskData['done']))? 'checked="checked':'')+'"/>\
					<span></span><div class="plan_task_content">'+taskData['content']+'</div>\
				</label>').appendTo(task_frame.children('.plan_task_list'));
			}
		}			
	}
	
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
		var taskData = new Array();
		$('.plan_task_item').each(function(){
			taskData.push({
				content: $(this).children('.plan_task_content').text(),
				done: $(this).children('input').prop('checked')
			});
		});
		var pageData = { 
			id: data['id'],
			now: bar.val(),
			taskData: taskData
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
				//var done = (pageData['now']-s)/(e-s);
			}
		});
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

var TurnToPage = function(page){
	$('#book').bookblock('jump', page, 100);
}

var CheckPlanInfo = function(){
	var msg = "";
	var msg2 = "";
	if($('#create_name').val().trim() == ""){
		msg += "\n計畫名稱";
	}
	if($('#create_unit').val().trim() == ""){
		msg += "\n單位";
	}
	if($('#create_start').val().trim() == ""){
		msg += "\n初始値";
	}
	else if(isNaN($('#create_start').val().trim())){
		msg2 += "初始値應為數字\n";
	}
	if($('#create_end').val().trim() == ""){
		msg += "\n目標値";
	}
	else if(isNaN($('#create_end').val().trim())){
		msg2 += "目標値應為數字\n";
	}
	if($('#create_deadDate').val().trim() == ""){
		msg += "\n結束日期";
	}
	if($('#create_deadTime').val().trim() == ""){
		msg += "\n結束時間";
	}
	
	if(msg != "" || msg2 != ""){
		msg = "請正確輸入" + msg + '\n\n';
		alert(msg+msg2);
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
