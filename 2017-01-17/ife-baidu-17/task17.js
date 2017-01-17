// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
var Time = document.getElementById("form-gra-time");
var citySelect = document.getElementById("city-select");
var chart = document.getElementById("chart");

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  // console.log(chartData[pageState.nowSelectCity].DD);
  // console.log(chartData[pageState.nowSelectCity].WW);
  var item = "";
  var i = 0;
  if(pageState.nowGraTime == "day"){
    item = "<h3>"+pageState.nowSelectCity+" 2016年01月-03月每天空气质量指数</h3>"
    var DData = chartData[pageState.nowSelectCity].DD;
    for(var d in DData){
       item += "<div style='width:8px;left:"+ (13*i)+";height:"+DData[d]+"px' class='rect1'></div>";
       i++;
    }
    chart.innerHTML = item;
  }else if(pageState.nowGraTime == "week"){
    item = "<h3>"+pageState.nowSelectCity+" 2016年01月-03月每周空气质量指数</h3>"
    var WData = chartData[pageState.nowSelectCity].WW;
    for(var d in WData){
       item += "<div style='width:50px;left:"+ (80*i)+";height:"+WData[d]+"px' class='rect1'></div>";
       i++;
    }
    chart.innerHTML = item;
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(gra) {
  // 确定是否选项发生了变化 
  var graValue = gra.getAttribute("data-value");
  if(graValue==pageState["nowGraTime"]){
  		return;
  }else{
     // 设置对应数据
  	 pageState["nowGraTime"] = graValue;
  }
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
 if(citySelect.value == pageState["nowSelectCity"]){
 	return;
 }else{
 	// 设置对应数据
 	pageState["nowSelectCity"] = citySelect.value;
 }
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	Time.addEventListener("click",function(e){
		// console.log(e);
		 if(e.target.className === "gra-time"){
       var nodeGroup = e.target.parentNode.childNodes;
       for(var i in nodeGroup){
          if(nodeGroup[i].className === "gra-time selected"){
            nodeGroup[i].className = "gra-time";
          }
       }
       e.target.className = "gra-time selected";
		 	 graTimeChange(e.target);
		 }
	})
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var item = "";
  for(var city in aqiSourceData){
  	item += "<option>"+city+"</option>";
  }
  citySelect.innerHTML = item;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.addEventListener("change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  for(var city in aqiSourceData){
    chartData[city] = {};
    // 保存每天的数据
    var tempDD = aqiSourceData[city];
  	chartData[city]["DD"] = tempDD;
    // 保存每周的平均数据
    var dataArr = Object.getOwnPropertyNames(tempDD).sort();//日期数组
    var dayTotal = dataArr.length //总天数 
    var firstWeek = 7 - new Date(dataArr[0]).getDay()+1;  //第一天周五,第一周为三天
    var aa = parseInt((dayTotal-firstWeek)/7);  //12整周
    var bb = (dayTotal-firstWeek)%7;  //最后一周有4天
    var tempWD = {};
    var tempArr = [];
    var sum =0;
    var temp = firstWeek;
    for(var i=0;i<aa+2;i++){
      if(i==0){
         dataArr.slice(0,firstWeek).forEach(function(item,index,array){
             sum += tempDD[item];
         })
         tempWD["第1周"] = parseInt(sum/firstWeek);
         sum = 0;
      }else if(i<aa+1 && i>0){
        var a = parseInt(temp)+parseInt(7*(i-1));
        var b = parseInt(temp)+parseInt(7*i);
        dataArr.slice(a,b).forEach(function(item,index,array){
             sum += tempDD[item];
        })
        tempWD["第"+(i+1)+"周"] = parseInt(sum/7);
        sum = 0;
      }else{
        dataArr.slice(dayTotal-bb,dayTotal).forEach(function(item,index,array){
             sum += tempDD[item];
        })
        tempWD["第"+(i+1)+"周"] = parseInt(sum/bb);
        sum = 0;
      }
    }
    chartData[city]["WW"] = tempWD;
    // 保存每月平均值
    
    
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart()
}

init();
