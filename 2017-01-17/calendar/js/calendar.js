var calendar = (function($){
	// 
	var Util = (function(){
		// 获取当月的天数
		var getDayNumber = function(year,month){
			switch(month){
				case 1: case 3:case 5:case 7:case 8:case 10: case 12:
					return 31;
				case 4: case 6: case 9: case 11:
					return 30;
				case 2:
					if(year % 4) return 28;
					else{
						if(year % 100) return 29;
						else{
							if(year % 400) return 28;
							else return 29;
						}
					}
				default:
					return 0;
			}
		};
		// 判断是否为当前月
		var judgeCurDay = function(dateStr){
			var temp = new Date();
			var date1 = new Date(temp.getFullYear()+"/"+(temp.getMonth()-0+1) +"/"+temp.getDate());
			return (new Date(dateStr).toString()===date1.toString());

		}
		return {
			getDayNumber : getDayNumber,
			judgeCurDay : judgeCurDay
		}
	})();
   
	var now = new Date();
	var curM = now.getMonth()+1; //当前月份
	var curY = now.getFullYear();   //当前年数
	var days = Util.getDayNumber(curY,curM); //当月总天数
	var firstDay = new Date(curY+"/"+curM+"/1").getDay(); //当月第一天
	var lastDay = new Date(curY+"/"+curM+"/"+days).getDay(); //当月最后一天
	var _date;

	// 更新参数
	function refresh(month){
		days = Util.getDayNumber(curY,curM);
	    firstDay = new Date(curY+"/"+curM+"/1").getDay();
	    lastDay = new Date(curY+"/"+curM+"/"+days).getDay(); 
	}
	// 绑定事件
	function BindEvent(){
		var select = $("#m_select");
		var plain = $("#m_select_plain");
		var mm = $("#month");
		$(document).click(function(e){
				plain.hide();
		});
		select.click(function(e){
			e.stopPropagation();
			plain.toggle();
		});
		plain.click(function(e){
			e.stopPropagation();
			var txt = e.target.innerHTML;
			$(e.target).addClass("current").siblings("li").removeClass("current");
			mm.text(txt);
			curM = parseInt(txt.substring(5,txt.length-1)); //当前月份
			curY = parseInt(txt.substring(0,4));
			refresh(curM);
			renderHTML(curY,curM,days,firstDay,lastDay);
			plain.hide();
		});
	}
	// UI渲染
	function renderHTML(year,month,days,firstDay,lastDay){
		var table = $("#date_view");
		var str = '<tr class="day">'+
					'<td>周日</td>'+
					'<td>周一</td>'+
					'<td>周二</td>'+
					'<td>周三</td>'+
					'<td>周四</td>'+
					'<td>周五</td>'+
					'<td>周六</td>'+
				'</tr><tr>';
		var row = Math.ceil((firstDay+days)/7);
		for(var i = 1;i<=row*7;i++){
			if(i < firstDay+1){
				str += "<td></td>";
			}
			else{
				if(!_date){
					_date = [];
				}
				var meta = _date[curY+"/"+curM+"/"+(i-firstDay)]?"<p>"+_date[curY+"/"+curM+"/"+(i-firstDay)]+"</p>":"";
				if((i-firstDay)<=days){
					if(Util.judgeCurDay(curY+"/"+curM+"/"+(i-firstDay))){
						str += "<td valign='top'><p class='today'>今日</p></td>";
					}else{
						str += "<td valign='top'>"+(i-firstDay)+meta+"</td>";
					}
				 }else
					str +="<td valign='top'></td>";
				if(!(i%7)){
					str += "</tr><tr>";
				}
			}
		}
		table.html(str);
	}
	function initHTML(){
		var select = $("#m_select");
		var plain = $("#m_select_plain");
		var plainStr = '';
		select.find("#month").text(curY+"年"+curM+"月");
		for(var i = curM;i<curM+12;i++){
			if(i<=12)
				plainStr += "<li>"+curY+"年"+i+"月</li>";
			else
				plainStr += "<li>"+(curY+1)+"年"+(i-12)+"月</li>";
		}
		plain.html(plainStr);
	}
	function init(url){
		initHTML();
		$.ajax({
			url : url,
			type : "GET",
			dataType : "json",
			success : function(data){
				if(data.result == "1"){
					_date = data.infors;
					renderHTML(curY,curM,days,firstDay,lastDay);
				}
			},
			error : function(){
				renderHTML(curY,curM,days,firstDay,lastDay);
			}
		});
		BindEvent();
	}

	return {
		init : init
	}
})(jQuery)
