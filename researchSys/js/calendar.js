
;(function ($) {

	function Calendar(config) {
		this.container = config.container || $('body'); //默认为body
		this.id = config.id || 'calen';  //默认为calen
		this.inputId = config.inputId || 'calendarInput';  //默认为calendarInput
		this.now = config.defaultDate ? new Date(config.defaultDate) : new Date(); //当前视图位置
		this.selected = {
			year: ['0', '0'],
			month: ['0', '0'],
			date: ['0', '0']
		};
		this.yearRange = config.yearRange || [1970, 2100]; //默认为1970 -- 2100 范围
		this.isSelectRange = config.isSelectRange;   //是否选择时间范围
		this.selectedRange = config.selectedRange;   //选择时间范围
		this.outOfRange = config.outOfRange;    //超出范围时的回调函数

		this.nowYear = this.now.getFullYear();  //年份
		this.nowMonth = this.now.getMonth() + 1;	//月份
		this.nowDate = this.now.getDate();   //这月的第几日	

	}


	Calendar.prototype = {

		init: function () {
			this.createThead();
			this.createTbody();
			this.createSelect();
//			this.createInput();
			this.bindEvent();

		},


		//创建表格头以及标题
		createThead: function () {
			var weekName = ['日', '一', '二', '三', '四', '五', '六']
			this.container.append(' <table class="calendarTable" id=' + this.id + '><thead><tr></tr></thead><tbody></tbody></table> ');
			var $thead = $('#' + this.id + ' > thead > tr');
			for (var i = 0, len = weekName.length; i < len; i++) {
				$thead.append('<th>' + weekName[i] + '</th>');
			}
		},

		createTbody: function () {

			var nowFirstDay = new Date(this.nowYear + "/" + this.nowMonth + "/" + 1).getDay();//这月一号是星期几//周几（0,1,2,3,4,5,6,）
			var nowMonthDays = getNowMonthDays(this.nowYear, this.nowMonth); //这个月的天数
			var lastMonthDays = getNowMonthDays(this.nowYear, this.nowMonth - 1); //上月的天数
			var daysData = [];
//			console.log(this.nowYear+','+this.nowMonth+','+','+nowFirstDay+','+nowMonthDays+','+lastMonthDays);
			//添加上个月的数据
			for (var i = lastMonthDays - nowFirstDay + 1, len = lastMonthDays; i <= len; i++) {
				daysData.push(i);
			}

			//添加这个月的数据
			for (var j = 1, len = nowMonthDays; j <= nowMonthDays; j++) {
				daysData.push(j);
			}

			//添加下个月的数据
			for (var k = 1; daysData.length < 42; k++) {
				daysData.push(k);
			}

			//渲染tbody
			daysData = changeArr(daysData); //将数据转换成二维数组，便于使用
			var $tbody = $('#' + this.id + ' > tbody ');
			$tbody.empty();
			for (var i = 0, rowLen = daysData.length; i < rowLen; i++) {
				var $tr = $('<tr></tr>')
				for (var j = 0, colLen = daysData[i].length; j < colLen; j++) {
					$tr.append('<td>' + daysData[i][j] + '</td>');
				}
				$tbody.append($tr);
			}
			$('#' + this.id + '>tbody td:lt(' + nowFirstDay + ')').addClass('lastMonth'); //标识上个月的日子
			$('#' + this.id + '>tbody td:gt(' + (nowFirstDay + nowMonthDays - 1) + ')').addClass('nextMonth');//标识下个月的日子

			for (var i = 0; i < 2; i++) {
//				console.log(this.selected.year[i]+','+this.nowYear+','+this.selected.month[i]+','+this.nowMonth+',')
				if (this.isSelectRange && this.selected.year[i] == this.nowYear && this.selected.month[i] == this.nowMonth) {
					$('#' + this.id + '>tbody td:eq(' + (nowFirstDay + this.selected.date[i] - 1) + ')').addClass('curDate');
				}
			}

		},

		//创建<select>年份月份选择
		createSelect: function () {
			var $curYearOption = this.nowYear - this.yearRange[0];
			var $tr = $('<tr></tr>');
			var $selectYear = $('<select id="' + this.id + '-year" ></select>');
			var $selectMonth = $('<select id="' + this.id + '-month"></select>');
			for (var begin = this.yearRange[0], end = this.yearRange[1]; begin < end; begin++) {
				$selectYear.append('<option value=' + begin + '>' + begin + '年</option>');
			}
			for (var i = 1; i < 13; i++) {
				$selectMonth.append('<option value=' + i + '>' + i + '月</option>');
			}

			$tr.append($('<th colspan="7"></th>').append($selectYear).append($selectMonth));
			$('#' + this.id + ' > thead ').prepend($tr);
			$('#' + this.id + '-year > option:eq(' + $curYearOption + '),#' + this.id + '-month > option:eq(' + (this.nowMonth - 1) + ')').attr('selected', true);  //设置默认选择项

			//选择时间段时，添加确定取消按钮
			if (this.isSelectRange) {
				$('#' + this.id).append('<tfoot><tr><td colspan="7"><button>确定</button><button>取消</button></td></tr></tfoot>');
			}

		},


		//绑定事件
		bindEvent: function () {
			var This = this;
			var nowFirstDay = new Date(This.nowYear + "/" + This.nowMonth + "/" + 1).getDay();
			var $input = $('#' + This.inputId);
			var selectFlag = 0;
			//select改变，渲染表格
			$('#' + this.id + '-year,#' + this.id + '-month').on('change', function () {
				This.now = new Date($('#' + This.id + '-year').val() + '/' + $('#' + This.id + '-month').val() + '/' + This.nowDate);

				This.refreshDate();
				This.createTbody();
			});

			//点击事件
			$('#' + this.id + ' > tbody ').on('click', 'td', function () {
				if (this.className == '') {
					//时间段选择的 日历面板点击事件处理
					if (This.isSelectRange) {
						nowFirstDay = new Date(This.nowYear + "/" + This.nowMonth + "/" + 1).getDay();
						This.selected.year[selectFlag % 2] = This.nowYear;
						This.selected.month[selectFlag % 2] = This.nowMonth;
						This.selected.date[selectFlag % 2] = parseInt($(this).html());
						selectFlag++;
						//为点击日期增加样式
						$('#' + This.id + ' > tbody  td ').removeClass('curDate');
						for (var i = 0; i < 2; i++) {
							//				console.log(This.selected.year[i]+','+This.nowYear+','+This.selected.month[i]+','+This.nowMonth+',')
							if (This.isSelectRange && This.selected.year[i] == This.nowYear && This.selected.month[i] == This.nowMonth) {
								$('#' + This.id + '>tbody td:eq(' + (nowFirstDay + This.selected.date[i] - 1) + ')').addClass('curDate');
							}
						}
						//更新输入框信息
						$input.val(function () {
							if ((This.selected.year[1] - This.selected.year[0]) * 365 + (This.selected.month[1] - This.selected.month[0]) * 30 + (This.selected.date[1] - This.selected.date[0]) > 0) {
								return This.selected.year[0] + '-' + numFormat(This.selected.month[0]) + '-' + numFormat(This.selected.date[0]) + ' To ' + This.selected.year[1] + '-' + numFormat(This.selected.month[1]) + '-' + numFormat(This.selected.date[1])
							}
							return This.selected.year[1] + '-' + numFormat(This.selected.month[1]) + '-' + numFormat(This.selected.date[1]) + ' To ' + This.selected.year[0] + '-' + numFormat(This.selected.month[0]) + '-' + numFormat(This.selected.date[0])

						})

					}


					//时间点选择时的面板点击事件处理
					else {
						$('#' + This.id + ' > tbody  td ').removeClass('curDate');
						$(this).addClass('curDate');
						$input.val(This.nowYear + '-' + numFormat(This.nowMonth) + '-' + numFormat($(this).html()));
						This.now = new Date($input.val());
						This.refreshDate();
						$('#' + This.id).css('display', 'none');
					}
				}

			});

			//时间段选择时 button点击事件
			$('#' + This.id + ' > tfoot td').on('click', 'button', function () {
				var days = Math.abs((This.selected.year[1] - This.selected.year[0]) * 365 + (This.selected.month[1] - This.selected.month[0]) * 30 + (This.selected.date[1] - This.selected.date[0]));
				//			console.log($(this).next('button').get(0));
				//			console.log($(this).next('button').get(0) && (days < This.selectedRange[0] || days > This.selectedRange[1]))

				//点击确定，输入为空时
				if ($input.val() == '' && $(this).next('button').get(0)) {
					alert('输入不能为空！');
					return false;
				}

				//点击确定按键，输入超出范围，清空输入框，运行设定的回调函数
				else if ($(this).next('button').get(0) && (days < This.selectedRange[0] || days > This.selectedRange[1])) {
					$input.val('');
					This.outOfRange();
				}
				//点击取消按键，清空输入框，隐藏日历面板
				else if (!$(this).next('button').get(0)) {
					$input.val('');
					$('#' + This.id + ' > tbody  td ').removeClass('curDate');
					$('#' + This.id).css('display', 'none');
				}

				//点击确定按键，且正确输入，隐藏日历面板
				else
					$('#' + This.id).css('display', 'none');

			})

			//输入框聚焦时调出日历面板，  点击除输入框和日历面板外的区域，隐藏面板
			$input.on('focus', function () {
				$('#' + This.id).css('display', 'table');
			})

			$(document).on('click', function () {
				$('#' + This.id).css('display', 'none');
			})

			$('#' + This.id + ',#' + This.inputId).on('click', function () {
				return false;
			})


			//加载时触发click事件
			$('#' + this.id + ' > tbody td:eq(' + (This.nowDate + nowFirstDay - 1) + ') ').trigger('click');


		},

		//更新当前选择时间
		refreshDate: function () {
			this.nowYear = this.now.getFullYear();  //年份
			this.nowMonth = this.now.getMonth() + 1;	//月份
			this.nowDate = this.now.getDate();   //这月的第几日			
		}


	}

	//获取当前选择月的天数
	function getNowMonthDays(year, month) {
		var days = 30;
		switch (month) {
			case 0:   //指代12月
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				days = 31;
				break;
			case 2:
				if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
					days = 29;
					break;
				}
				else
					days = 28;
				break;
		}
		return days;
	}

	//将一维数组转换成二维数组，仅用于日历
	function changeArr(arr) {
		var newArr = [];
		for (var i = 0, len = arr.length / 7; i < len; i++) {
			newArr.push([arr[i * 7], arr[i * 7 + 1], arr[i * 7 + 2], arr[i * 7 + 3], arr[i * 7 + 4], arr[i * 7 + 5], arr[i * 7 + 6]]);
		}
		return newArr;
	}

	//不足10的数字前面加0
	function numFormat(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num;
	}


	$.fn.extend({
		calendar: function (config) {
			config.inputId = $(this).attr('id');
			config.container = $(this).parent();
			var newCalen = new Calendar(config);
			newCalen.init();
			return $(this); //链式操作
		}
	})
})(jQuery);


/*
参考使用方式，input需要绑定calendar类
依赖 jQuery , calendar.js

	<input type="text" id="calendarPoint" class="calendar">
		
	<script type="text/javascript">
			$('#calendarPoint').calendar({
				yearRange: [1900,2100],
				defaultDate: '2016-04-01',
				isSelectRange: false  	//选择时间点	
			})
	</script>


 */
