var pages = new Array();
var bottom;
/*------Initialization------*/
$(document).ready(function(){	
	display_auth();
});

/*------Event Handler------*/
$(document).ready(function(){	
	$(window).resize(function(){
		display_auth();
	});
	
	if(hide_aside) 
		$('aside').append('<div id="aside_arrow"></div>');
	
	/*------aside------*/
	$('#aside_switch').click(function(){
		var h = $(window).height();
    	if(hide_aside){
			$('#aside_arrow').remove();
        	$('aside').animate(
            	{'bottom':  bottom+'px'},
                600
            );
			$('#aside_arrow').remove();
		}
        else{
        	$('aside').animate(
            	{'bottom': '-315px'},
                600
            );
			$('aside').append('<div id="aside_arrow"></div>');
		}
        hide_aside = !hide_aside;
    });
	
	$('#aside_checkboxs input[type=checkbox].check_done').change(function(){
		$('#list_done').toggle(1);
	});
	$('#aside_checkboxs input[type=checkbox].check_undone').change(function(){
		$('#list_undone').toggle(1);
	});
	$('#aside_checkboxs input[type=checkbox].check_expired').change(function(){
		$('#list_expired').toggle(1);
	});
	
	$('#menu_logout').click(function(){
		ClearCookie();
		location.reload();
	});
	
});

var display_auth = function(){
	var h = $(window).height();
    var w = $(window).width();
	
	$('#book-base').css('width',$('#book').width()+115);
	$('#book-base').css('height',$('#book').height()+120);
	
	if(w > $('#book-base').width() + $('aside').width()){
		$('#book').css('left', (w-$('#aside_contents').width()-$('#book').width())/2);
		$('#book').css('top', (h-$('#book').height())/2);
		$('aside').css('bottom', (h-$('#aside_contents').height())/2);
		bottom = (h-$('#aside_contents').height())/2;
		hide_aside = false;
	}
	else{
		var book_h = (h-$('#book-base').height())/2 + 40;
		$('#book').css('left', (w-$('#book').width())/2);
		$('#book').css('top', (book_h>100)? book_h: 100);
		$('aside').css('bottom', -315);
		bottom = 70;
		hide_aside = true;
    }
	
	$('#book-base').css('left',$('#book').position().left-46);
	$('#book-base').css('top',$('#book').position().top-20);

	$('#loading').css('top', (h - $('#loading').height())/2);
	$('#loading').css('left', (w - $('#loading').width())/2);
	
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
			$('#list_plans').append('<div id="list_undone"></div>');
			$('#list_plans').append('<div id="list_done"></div>');
			$('#list_plans').append('<div id="list_expired"></div>');
			
			$('#aside_checkboxs input[type=checkbox]').prop('checked', 'checked');
			
			if(pages.length)
				pages.length = 0;

			var planPacket = $.parseJSON(response);
			var undone = $.parseJSON(planPacket['undone']);
			var done = $.parseJSON(planPacket['done']);
			var expired = $.parseJSON(planPacket['expired']);
			var user_info = $.parseJSON(planPacket['user_info']);

			pages.push(AddCreatePage());
			pages.push(AddPersonalPage(user_info, true));

			for(var i in undone){
				var planData = $.parseJSON(undone[i]);
				AddPlanPage(planData, true, $('#list_undone'));
			}

			for(var i in done){
				var planData = $.parseJSON(done[i]);
				AddPlanPage(planData, true, $('#list_done'));
			}

			for(var i in expired){
				var planData = $.parseJSON(expired[i]);
				AddPlanPage(planData, true, $('#list_expired'));
			}
			
			$('#new_plan').unbind('click').click(function(){
				TurnToPage(1);
			});
			
			$('#aside_personalinfo').unbind('click').click(function(){	
				TurnToPage(2);
			});
			
			$('#book').bookblock();
			display_auth();
		}
	});
}

var AddPlanPage = function(planData, personal, list){
	var list_item = $('<li><div class="aside_murmur"></div>' + planData['name'] + '</li>').appendTo(list);
	pages.push(AddPlanPage1(planData, personal));
	pages.push(AddPlanPage2(planData, personal));
	var page_num = pages.length;
	list_item.click(function(){
		TurnToPage(page_num - 1);
	});
	list_item.children('.aside_murmur').click(function(e){
		e.stopPropagation();
		TurnToPage(page_num);
	});
	list_item.bind({
		mouseenter: function(){
			$(this).css('color', 'yellow');
			$(this).css('cursor', 'pointer');
		},
		mouseleave: function(){
			$(this).css('color', 'brown');
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
									<span></span><div class="create_task_content">範例 : 記得先...</div>\
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
		$("#create_deadDate").focus(function(){
			if(!$("#create_deadDate").val())
				$("#create_deadDate").datepicker("setDate", new Date());
		});
	}); 
	$(function(){
		$("#create_deadTime").timepicker({timeFormat: 'HH:mm:ss'});
		$("#create_deadTime").focus(function(){
			if(!$("#create_deadTime").val())
				$("#create_deadTime").timepicker("setTime", new Date());
		});
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
				goal: $('#create_end').val(),
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
					AddPlanPage(pageData, true, $('#list_undone'));

					$('#create_back').trigger('click');
					$('#book').bookblock();
					TurnToPage(pages.length - 1);
					$('#create_task_list').empty();
				}
			});
		}
	});
	
	$('#create_back').click(function(){
		$('#page_create input').val('');
	});
	
	$('#create_task_list').sortable({ cursor: "move" });
	$('#create_task_list').disableSelection();
	
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
		<div id="info_name" class="IDCard_content"><label>姓名： </label>'+data['first_name']+data['last_name']+'</div>\
		<div id="info_id" class="IDCard_content"><label>ID: </label>'+data['acc']+'</div>\
		<div id="info_gender" class="IDCard_content"><label>性別： </label>'+((parseInt(data['male']))? '男':'女')+'</div>\
		<div id="plan_count" class="IDCard_content"><label>完成計畫： </label><label>'+data['total_done']+'項</label></div>\
		<div id="info_mail" class="IDCard_content"><label>電子郵件：</label><br/>'+data['mail']+'</div>'
	).appendTo(page_left);
	
	page_right.append(
		'<div id="label_undone">\
			<img src="../PlanIt/img/info/plan_undone.png" alt="plan_undone" height="40" width="160">\
			<div class="ex_plan">\
				<ol>\
				</ol>\
			</div>\
		</div>\
		<div id="label_done">\
			<img src="../PlanIt/img/info/plan_done.png" alt="plan_done" height="40" width="160">\
			<div class="ex_plan">\
				<ol>\
				</ol>\
			</div>\
		</div>\
		<div id="label_expired">\
			<img src="../PlanIt/img/info/plan_expired.png" alt="plan_expired" height="40" width="160">\
			<div class="ex_plan">\
				<ol>\
				</ol>\
			</div>\
		</div>');
		
	var recent_expired = $.parseJSON(data['expired']);
	var recent_done = $.parseJSON(data['done']);
	var recent_undone = $.parseJSON(data['undone']);
	
	for(var i in recent_expired){
		var recent_item = $.parseJSON(recent_expired[i]);
		page_right.children('#label_expired').children('.ex_plan').children('ol').append(
		'<li>'+recent_item['name']+'</li>');
	}
	
	for(var i in recent_undone){
		var recent_item = $.parseJSON(recent_undone[i]);
		page_right.children('#label_undone').children('.ex_plan').children('ol').append(
		'<li>'+recent_item['name']+'</li>');
	}
	
	for(var i in recent_done){
		var recent_item = $.parseJSON(recent_done[i]);
		page_right.children('#label_done').children('.ex_plan').children('ol').append(
		'<li>'+recent_item['name']+'</li>');
	}

	//-----------------------------
	return page;
}

var AddPlanPage1 = function(data, personal){
	var s = parseInt(data['start']), e = parseInt(data['goal']), n = parseInt(data['now']), u = data['unit'];
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
			var cur = (new Date()).getTime();
			var expired = (new Date(data['deadline'])).getTime();
			plan_right.prepend('<div class="plan_time"></div>');
			
			var str = '';
			if(expired > cur){
				var dis = expired - cur;
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
				str = '剩餘 '+str;
			}
			else{
				str = '已過期';
			}
			str = '計畫期限：'+data['deadline'] +'<br/>'+ str;
			plan_right.children('.plan_time').html(str);
			plan_right.children('.plan_time').css('display', 'block');
		},
		function(){
			plan_right.children('.plan_time').css('display', 'none');
		}
	);

	progress_frame.append('<div class="plan_progressscale"></div>');
	progress_frame.append('<div class="plan_max">'+data['goal']+'<br/>'+data['unit']+'</div>');
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
	
	move_bean(s,e, bar.val(),game);
	
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
			<input type="text" class="plan_newTask" placeholder="輸入待辦事項">'
			+((personal)? '<div class="plan_addNewTask"></div>':'')
			+'<div class="plan_task_list"></div>\
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
			if(personal){
				var btn_delete = $('<div class="plan_task_delete"></div>').appendTo(task);
				btn_delete.click(function(){
					$(this).parent().remove();
				});
			}
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
	
	task_frame.children('.plan_task_list').sortable({ cursor: "move" });
	task_frame.children('.plan_task_list').disableSelection();
	
	if(data['task']){
		var tasks = $.parseJSON(data['task']);
		for(var i in tasks){
			if(tasks[i]){
				taskData = $.parseJSON(tasks[i]);
				var task = $('<label onclick="checkboxToggle(this)" class="plan_task_item">\
					<input type="checkbox" class="checkbox"'+((parseInt(taskData['done']))? 'checked="checked':'')+'"/>\
					<span></span><div class="plan_task_content">'+taskData['content']+'</div>\
				</label>').appendTo(task_frame.children('.plan_task_list'));
				var btn_delete = $('<div class="plan_task_delete"></div>').appendTo(task);
				btn_delete.click(function(){
					$(this).parent().remove();
				});
			}
		}			
	}
	
	plan_right.append('<div class="plan_next"></div>');
	plan_right.children('.plan_next').click(function(){
		$('#book').bookblock('next');
	});

	var button_save;
	if(personal){
		button_save = SetSaveButton(plan_right);
		button_save.click(function(){
			var taskData = new Array();
			task_frame.children('.plan_task_list').children('.plan_task_item').each(function(){
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
					move_bean(s,e, bar.val(),game);
					setTimeout(function(){
						var cur = (new Date()).getTime();
						var expired = (new Date(data['deadline'])).getTime();
						if(cur >= expired || bar.val() == e){
							if(button_save) button_save.remove();
							plan_right.find('input').attr('disabled', 'disabled');
							plan_right.find('textarea').attr('disabled', 'disabled');
							
							if(bar.val() == e){
								var dialog_finish = $(	
									'<div class="ui small modal" id="dialog_finish">\
										<div id="finish_bling">\
											<div id="finish_bean"></div>\
										</div>\
										<div id="finish_button"></div>\
									</div>'
								).appendTo($('body')).modal('show');
								$('#finish_button').click(function(){
									dialog_finish.modal('hide', function(){
										dialog_finish.remove();
									});
								});
								game.empty();
								game.addClass('done');
								clock.addClass('done');
							}
							else if(cur >= expired){
								game.empty();
								game.addClass('expired');
								clock.addClass('expired');
							}
							return;
						}					
					}, 1000);
				}
			});
			
		});
	}
	else{
		plan_right.find('input').attr('disabled', 'disabled');
		plan_right.find('textarea').attr('disabled', 'disabled');
	}
	
	var cur = (new Date()).getTime();
	var expired = (new Date(data['deadline'])).getTime();
	
	if(cur >= expired || bar.val() == e){
		if(button_save) button_save.remove();
		plan_right.find('input').attr('disabled', 'disabled');
		plan_right.find('textarea').attr('disabled', 'disabled');
		if(bar.val() == e){
			game.empty();
			game.addClass('done');
			clock.addClass('done');
		}
		else if(cur >= expired){
			game.empty();
			game.addClass('expired');
			clock.addClass('expired');
		}
		return;
	}
	return page;
}

var AddPlanPage2 = function(data, personal){
	var page = $('<div class="bb-item"></div>').appendTo($('#book'));
	var plan_left = $('<div class="page_left"></div>').appendTo(page);
	var plan_right = $('<div class="page_right"></div>').appendTo(page);
	
	plan_left.append('<div class="plan_memo_bg"><textarea class="plan_memo"></textarea></div>');
	plan_left.append('<div class="plan_prev"></div>');
	plan_left.children('.plan_prev').click(function(){
		$('#book').bookblock('prev');
	});
	
	plan_right.append('<div class="ui comments">\
						<form class="ui reply form" style="width: 90%; margin: 0 auto;">\
							<div class="field" style="width: 90%;" >\
								<textarea class="input_comment" name="input_comment"\
									style="min-height: 40px; height: 76px; padding: 5px;\
											overflow: hidden; margin-top: 0px; border: 5px solid #7794BF;\
											resize: none; margin-bottom: 0px; width: 80%; border-radius: 15px;"\
									placeholder="來留個言吧!!!!!!"></textarea>\
							</div>\
							<div class="comment_talk"></div>\
							<div class="add_comment '+((parseInt(data['male']))? 'boy':'girl')+'"></div>\
						</form>\
						<span style="color:gray; font-size: 10px; margin-left: 20px;">按Enter送出留言，按Shift+Enter換行。</span>\
						<div class="comment_content" style="overflow-y: auto; height: 80%;"></div>\
					</div>');
	var form = plan_right.children().children('form');
	var input = form.children('.field').children('.input_comment');
	var content = form.parent().children(".comment_content");	
	if(data['comment']){
		var comment = $.parseJSON(data['comment']);
		for(var i in comment){
			if(comment[i]){
				comData = $.parseJSON(comment[i]);
				content.append(
					'<div class="comment">\
						<a class="author">'
						+ comData['user_name'] +
						'</a>\
						<div class="text">'
						+ comData['content'].replace(/\n/g, "<br/>")+
						'</div>\
					</div>');
			}
		}			
	}
	
	form.keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			if(!e.shiftKey){
				var comment = input.val();
				// uer name
				if(comment != "") {
					alert(comment);
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
							$('<div class="comment">\
									<a class="author">'+ username +'</a>\
									<div class="text">'+ comment.replace(/\n/g, "<br/>") +'</div>\
								</div>').appendTo(content);
							content.scrollTop(content.prop("scrollHeight"));
							input.val('').keydown();
						}
					});
				}
			}
			
		}
	});
	
	content.scrollTop(content.prop("scrollHeight"));
	input.css("overflow","hidden").bind("keydown keyup", function(){  
        $(this).height('0px').height($(this).prop("scrollHeight")+"px");
		content.height((plan_right.height()*0.82 - $(this).height()) + "px");
		content.scrollTop(content.prop("scrollHeight"));
    }).keydown();
	
	content.height(356);
	
	if(personal){
		plan_left.children('.plan_memo_bg').children('.plan_memo').val(data['memo']);
		var button_save = SetSaveButton(plan_left);
		button_save.click(function(){
			var pageData = { 
				id: data['id'],
				content: plan_left.children('.plan_memo_bg').children('.plan_memo').val()
			};
			
			$.ajax({
				url: 'php/updateMemo.php',
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
	}
	else{
		plan_left.children('.plan_memo_bg').children('.plan_memo').remove();
		plan_left.children('.plan_memo_bg').append(
			'<div style="width: 100%;\
				height: 100%;\
				vertical-align: bottom;\
				text-align: center;\
				font-size: 24px;\
				margin: 190px auto 0 auto;\
				font-weight: bold;\
				color: gray;">你沒辦法看見好友的筆記喔！</div>');
		plan_left.find('input').attr('disabled', 'disabled');
		plan_left.find('textarea').attr('disabled', 'disabled');
	}
	
	return page;
}

var SetSaveButton = function(page){
	var div_button = $('<div class="button"></div>').appendTo(page);	
	var button_save = $('<a href="#" class="save">Save<span></span></a>').appendTo(div_button);
	return button_save;
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
	if(!isNaN($('#create_start').val().trim()) && !isNaN($('#create_end').val().trim())){
		if(parseInt($('#create_start').val().trim()) == parseInt($('#create_end').val().trim())){
			msg2 += "初始值和目標值不可相同\n";
		}
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

//data['now']

var move_bean = function(start,goal,now,game){
	var progress = (now-start)/(goal-start)*100;
	var bean_original = game.children('.game_bean').position().left;
	var container_original = game.children('.game_container').position().top;
	
	if(bean_original == 0){
		bean_original = 136;
		container_original = 129;
	}
	
	
	var bean_move = 136+progress-bean_original;
	var bean_next = 136+progress;
	
	game.children('.game_bean').animate({'left':bean_next+'px'},1000);
	game.children('.game_ropeX').animate({'width':game.children('.game_ropeX').width()+bean_move+'px'},1000);
	game.children('.game_ropeY').animate({'height':game.children('.game_ropeY').height()-bean_move+'px'},1000);
	game.children('.game_container').animate({'top':container_original-bean_move+'px'},1000);
}

