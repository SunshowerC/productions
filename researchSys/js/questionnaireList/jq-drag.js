
// ;(function(){
	$.fn.extend({
		dragging:function(data){
			var $this = $(this);
			
			var disX;//
			var disY;//
			var positionX;
			var positionY;				
			var nowX,nowY;
			var defaults = {
				move : 'both',
				hander: 1
			}
			var opt = $.extend({},defaults,data);
			var hander = opt.hander;
		
			var mDownFlag;
			
			if(hander == 1){
				hander = $this; 
			} else {
				hander = $this.find(opt.hander);
			}			

			hander.css({"cursor":"move"});

			hander.on('mousedown',function(e){
				e = e || window.event;
				mDownFlag = true;
						
				positionX = $this.offset().left;
				positionY = $this.offset().top;

				disX = e.clientX - positionX;
				disY = e.clientY - positionY;


			});

			$(document).on('mousemove',function(e){
				e = e || window.event;
				// movePanel();
				
				if (mDownFlag) {
					nowX = (e.clientX - disX) ;
					nowY = (e.clientY - disY) ;	
					if (opt.modal) {

					}				
					switch(opt.move) {
						case 'x':$this.offset({left:nowX});break;
						case 'y':$this.offset({top:nowY});break;
						case 'both':$this.offset({left:nowX,top:nowY});break;
					}
				}
			});

			$(document).on('mouseup',function(){
				mDownFlag = false;
			})

		}
	});

// })()
