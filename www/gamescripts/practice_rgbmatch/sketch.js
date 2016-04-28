var firstCount=false;
var count=60;
var counter;

var score = 0;

var rSlider, gSlider, bSlider;

var c; 
var r;
var g;
var b;
var level = 1;


//vars for labels
var title;
var rLabel;
var gLabel;
var bLabel;
var inst;

var valR = 0;
var valG = 0;
var valB = 0;


function setup() {
	
	// create canvas
	c = createCanvas(windowWidth, 410);
	c.parent('sketch-container');
	c.position(10, 50);


	r = 255;
	g = 3;
	b = 150;
}

function draw() {

	if (firstCount==true){
		countDown();
	}

	var framesPerSecond = frameCount/60;

	var timer = round(framesPerSecond);

	
	valR = $('#redslider').val();
	valG = $('#greenslider').val();
	valB = $('#blueslider').val();
	
	fill(this.valR, this.valG, this.valB);
	stroke(5);
	rect(0, 10, windowWidth-20, 80);

	var distR = dist(valR, 1, r, 1);
	var distG = dist(valG, 1, g, 1);
	var distB = dist(valB, 1, b, 1);

	fill(r, g, b);
	stroke(5);
	rect(0, 100, windowWidth-20, 80);	

	if ((distR < 20) && (distG < 20) && (distB < 20)) {
		//youWin = true;

		youWin();

		level++;
		r = floor(random(255));
		g = floor(random(255));
		b = floor(random(255));
	}

  
// if (youWin == true) {
// 	noLoop();
// 	window.location.hash = '#forthpage'

// }
}

$(document).on("pageshow","#thirdpage",function(){ // When entering pagetwo
   firstCount=true;
});

function reStart() {

//youWin = false;

loop();

countDown();

		// r = floor(random(255));
		// g = floor(random(255));
		// b = floor(random(255));

		//save rgb data
			var RGBdata = [];

			var lastValue = localStorage.getItem("RGBsarray");
        	if (lastValue != null) {


         	RGBdata = JSON.parse(lastValue);
          	console.log(RGBdata);

          }

            var RGBdetails = {};
            RGBdetails.Red = $('#redslider').val();
            RGBdetails.Blue = $('#blueslider').val();
            RGBdetails.Green = $('#greenslider').val();
            RGBdata.push(RGBdetails);

            localStorage.setItem('RGBarray',JSON.stringify(RGBdata));
            

        }

function countDown() { 

firstCount=false;      

count=60;

counter=setInterval(timer, 1000); //1000 will  run it every 1 second

function timer()
{
  count=count-1;
  if (count <= 0)
  {
     clearInterval(counter);
     youLost();
     return;
  }

 document.getElementById("timer").innerHTML="Timer: " + count;

}

}
//place in html to show timer
//<span id="timer">
// });

function youWin(){
	noLoop();

	addScore()
	clearInterval(counter);
	window.location.hash = '#forthpage';
	
	
}

function youLost() {
	level++;
		r = floor(random(255));
		g = floor(random(255));
		b = floor(random(255));
		
	noLoop();
	window.location.hash = '#fifthpage'

}

function addScore(){
	score++;
 
	scoreDiv = document.getElementById("score");
	
	scoreDiv.innerHTML = "Score: " + score;
 
}