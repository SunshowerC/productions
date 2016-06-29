
// checkbox全选事件
var checkboxEvent = function(){
	var $questBox = $('.questionnaireTab tbody input');
	$('#checkedAll').on('click',function(){
		$questBox.prop('checked',this.checked)  ;
		// $questBox.attr('checked',this.checked)  ;
		// console.log($(".questionnaireTab tbody input:checked").length)

	})

	$questBox.on('click',function(){
		// console.log($(".questionnaireTab tbody input:checked").length)
		$("#checkedAll").prop("checked",
			$questBox.length == $(".questionnaireTab tbody input:checked").length ? 'checked' : '');
	})		
}

//删除按钮 事件绑定

var deleteHandle = function (researchs) {
	
	$('.questionnaireTab').on('click','a',function(e){
		var This = this;  //This 为 <a>
		var thisTr = $(This).parents('tr');


		switch(this.className) {
			case 'editQuest' :
				localStorage.activeResearchId = thisTr.find('input').attr('id');
				break;
			case 'checkData' :
				localStorage.activeResearchId = thisTr.find('input').attr('id');
				break;
			case 'checkQuest':
				localStorage.activeResearchId = thisTr.find('input').attr('id');
				break;
			case 'newQuest' :
				localStorage.activeResearchId = '' ;
				break;
		}

		if ( this.className.indexOf('deleteQuest') > -1 ) {
			$('#dialog-modal').dialog({
				title: '系统提示',
				content: '确定要删除此问卷？',
				height: 200,
				button: {
					'确定': function(){
						if (e.target.className == 'deleteQuest') {  // tbody 的删除按钮
							$(This).parents('tr').remove();
							var thisQuestId = thisTr.find('input').attr('id');
							researchs.forEach(function(item,index,array){
								if (thisQuestId == item.researchId ) {
									// delete researchs[index];
									researchs.splice(index,1);
									localStorage.setItem('paperMsg',JSON.stringify(researchs) ) ;
									// console.log(researchs)
								}
							});

						} else {   //tfoot 的删除按钮
							var $checkedInput = $(".questionnaireTab tbody input:checked");
							$checkedInput.parents('tr').remove();
							$checkedInput.each(function(index,element){
								researchs.forEach(function(item,index){
									if (element.id == item.researchId) {
										researchs.splice(index,1);
										localStorage.setItem('paperMsg',JSON.stringify(researchs) ) ;
									}
								});
							});
						}
					},
					'取消': function(){
					}
				}
			});
		}

		e.stopPropagation();
	});
}


/*
* 加载时渲染表格
 */
var loadedRender = function($container, researchs) {
	var data = {
		newQuestHref: 'edit.html',
		editQuestHref: 'edit.html',
		checkDataHref: 'showData.html',
		answerQuestionnaireHref: 'answerQuestionnaire.html',
		researchs: researchs
	}


	changeState(researchs);

	var render = _.template($('#questListTpl').html());
	// console.log( render(data) );
	$container.append( render(data) );


	function changeState(researchs) {
		var nowDate = new Date();
		for (var i = 0,len = researchs.length; i < len ;i++) {
			var deadline =  new Date(researchs[i].deadline);
			if (deadline < nowDate) {
				researchs[i].state = 3 ;
			}
		}
	}
	
}



var initQuestList = function ($container, researchs) {
	loadedRender($container, researchs);
	checkboxEvent();
	deleteHandle(researchs);
}

	


