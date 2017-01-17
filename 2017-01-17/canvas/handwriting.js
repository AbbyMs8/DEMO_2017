var canvasWidth = 800;
var canvasHeight = canvasWidth;
var isMouseDown = false;
var Lastloc = {x:0,y:0};
var LastTime = 0;
var LastWidth = -1;
var strokeColor = "#000";

var canvas = document.getElementById("handW");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

drawGrid();

canvas.onmousedown = function(e){
	e.preventDefault();
	isMouseDown = true;
	first = true;
	Lastloc = windowToCanvas(e.clientX,e.clientY);
	LastTime = new Date().getTime();
};
canvas.onmouseup = function(e){
	e.preventDefault();
	isMouseDown = false;
};
canvas.onmouseout = function(e){
	e.preventDefault();
	isMouseDown = false;
};
canvas.onmousemove = function(e){
	e.preventDefault();
	if(isMouseDown){
		var curLoc = windowToCanvas(e.clientX,e.clientY);
		var curTime = new Date().getTime();
		// draw
		context.beginPath();
		context.moveTo(Lastloc.x,Lastloc.y);
		context.lineTo(curLoc.x,curLoc.y);
		var s = calcDistance(curLoc,Lastloc);
		var t = curTime-LastTime;

		var lineWidth = calcLineWidth(t,s);

		context.strokeStyle = strokeColor;
		context.lineWidth = lineWidth;
		context.lineCap="round";
		context.lineJoin = "round";
		context.stroke();
		Lastloc = curLoc;
		LastTime = curTime;
	}
};

$(".colorBtn").on("click",function(e){
	 var curColor = $(this).attr("id").replace("_btn","");
	 $(this).addClass("active").siblings().removeClass("active");
	 strokeColor = curColor;
	 
});
$("#clear_btn").on("click",function(e){
	 context.clearRect(0,0,canvasWidth,canvasHeight);
	 drawGrid();
})

function windowToCanvas(x,y){
	var bbox = canvas.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}

function calcDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)-(loc1.y-loc2.y)*(loc1.y-loc2.y));
}

function calcLineWidth(t,s){
	var v = s/t;

	var resultLineWidth;
	if(v<=0.1){
		resultLineWidth = 30;
	}else if(v>=10){
		resultLineWidth = 1;
	}else{
		resultLineWidth = 30 - (v-0.1)/(10-0.1)*(30-1);
	}
	return resultLineWidth;
}


function drawGrid(){
	context.save();
	context.strokeStyle = "rgb(230,11,9)";
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);

	context.moveTo(canvasWidth-3,3);
	context.lineTo(3,canvasHeight-3);

	context.moveTo(3,canvasHeight/2);
	context.lineTo(canvasWidth-3,canvasHeight/2);

	context.moveTo(canvasWidth/2,3);
	context.lineTo(canvasWidth/2,canvasHeight-3);
	context.closePath();

	context.lineWidth = 1;
	context.stroke();
	context.restore();
}



