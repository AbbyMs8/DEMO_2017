;(function(window,$){
	"use strict"
	// 默认参数
	var defaults = {
		sortRow : 0,
		data : {
			0 : ["姓名","数学","语文","英语","物理"],
			1 : ["Alberto","78","95","100","86"],
			2 : ["Dasiy","87","84","89","100"],
			3 : ["Carol","100","99","65","99"],
			4 : ["Max","68","100","76","65"],
			5 : ["Sissel","97","54","88","98"],
			6 : ["Tyer","88","64","55","56"],
			7 : ["Andewn","65","78","98","73"]
		}
	}
	// 构造函数
	function sortTable(el,options){
		this.$el = $(el);
		this.options = options;

		this.init();
	}

	// 原型对象
	sortTable.prototype = {
		// 添加排序按钮
		addSortBtn : function(){
			var data = this.options.data;
			var Oth = this.$el.find("th");
			for(var i = 1;i<Oth.length;i++){
				$(Oth[i]).append('<div data-row=' + i + ' class="sortBtns"><i class="acs"></i><i class="desc"></i>')
			}
		},
		// 创建HTML
		renderHtml : function(){
			var data = this.options.data;
			var item = '<thead><tr>';
			for(var i in data){
				if(i == 0){
					for(var j = 0;j<data[i].length;j++){
						item += '<th>'+data[i][j]+'</th>';
					}
					item += '</tr></thead><tbody>';
				}else{
					item += '<tr>'
					for(var j = 0;j<data[i].length;j++){
						item += '<td>'+data[i][j]+'</td>';
					}
					item += '</tr>';
				}
			}
			item += '</tbody>';
			this.$el.html(item);
			this.addSortBtn();
		},
		// 排序，第col项按way(acs,desc)方式排序
		order : function(col,way){
			var data = this.options.data;
			var tempArray = [];
			// data对象转换为数组，方便按某一项值排序
			for(var i in data){
				if(i>0){
					tempArray.push(data[i]);
				}
			}
			// 以下两种方式排序
			if(way == 'acs'){  //升序
				tempArray.sort(function(a,b){
					a[col] = parseInt(a[col]);
					b[col] = parseInt(b[col]);
					if(a[col] > b[col]) return 1;
					else if(a[col] < b[col]) return -1;
					else return 0;
				});
			}
			else{   //降序
				tempArray.sort(function(a,b){
					a[col] = parseInt(a[col]);
					b[col] = parseInt(b[col]);
					if(a[col] < b[col]) return 1;
					else if(a[col] > b[col]) return -1;
					else return 0;
				});
			}
			// 排序过的数据更新参数中的data。
			for(var i = 0;i<tempArray.length;i++){
				this.options.data[i+1] = tempArray[i];
			}
			// 渲染
			this.renderHtml();
		},
		// 事件代理
		bindHandle : function(){
			var self = this;
			this.$el.on('click','.acs,.desc',function(e){
				// 获取排序按钮所在的列
				var col = $(e.target).parent('.sortBtns').attr("data-row");
				self.order(col,e.target.className);
			})
		},
		init : function(){
			this.renderHtml(); //渲染表格
			this.bindHandle(); //绑定时间
		}
	};

	// 注册到jquery
	$.fn.sortTable = function(options){
		options = $.extend(defaults,options||{})  //设置参数

		for(var i = 0;i<$(this).length;i++){
			new sortTable($(this)[i],options);
		}
	}
})(window,jQuery);
