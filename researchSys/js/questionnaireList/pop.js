
// ;(function(){
	function Pop(options) {
		for(var name in options) {
			this[name] = options[name];
		}
		// console.log(this);
	//	this.init();
	}

	Pop.prototype = {
		init: function() {
			this.createMask();
			this.createPopup();
			this.bindEvent();
		},

		createMask: function() {
			if (this.modal) {
				$('body').append('<div class="pop-up-mask"></div>')
				$('.pop-up-mask').fadeTo(400,0.7);
			}
		},

		createPopup: function() {
			var This = this;
			This.popup.append(
					'<div class="popupPanel">' +
						'<h2 class="pop-up-title">' + this.title + '</h2>'+
						'<div class="pop-up-content" style="height:' + (This.height-90) +'px" >' + this.content + '</div>' +
						'<div class="pop-up-button">' + 
						'</div>' +
					'</div>'
				);
			var btnGroup = This.popup.find('.pop-up-button');
			
			for( btnName in This.button) {
				var $btn = $('<button></button') ;
				$btn.html(btnName) ;

				(function(btnName){
					$btn.on('click', function(e){
						This.button[btnName]();
						This.close();
						e.stopPropagation() ;  					
					});					
				}(btnName));

				btnGroup.append($btn);
			}
			$('.popupPanel').slideDown(400);
		},

		close: function() {
			var This = this;
			$('.popupPanel').slideUp(400,function(){
				This.popup.empty();
			});
			$('.pop-up-mask').fadeOut(400,function(){
				$('.pop-up-mask').remove();				
			});
			this.unbindEvent();
		},

		unbindEvent: function() {
			$(document).off('click');
		},

		bindEvent: function() {
			var This = this;
			var panel = this.popup.children('.popupPanel');
			/*拖拽事件*/
			if (this.drag) {
				panel.dragging({
					hander: '.pop-up-title',  //绑定的可拖拽的块
					move: 'both'  //x ,y ,both
				});
			}

			$(document).on('click',function(){
				This.close();
			});

			This.popup.on('click',function(e){
				e.stopPropagation();
			})

		}
	}


	$.fn.extend({
		dialog:function(options) {
			var defaultOptions = {
				popup: $(this),
				width: '20%' ,
				height: '200' ,
				title: '',
				content: '',
				button: {
					'确定': function(){},
					'取消': function(){}
				},
				modal: true,
				drag: true
			};
			$.extend(defaultOptions,options);

			var newPop = new Pop(defaultOptions);
			newPop.init();
			return $(this) ; //链式操作
		}
	});	

// })();





