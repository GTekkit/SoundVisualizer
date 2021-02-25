/*
SoundOverTime.js
Created by Grady Marshall
8/11/19
About:
  This is a Program that uses the sound analysis skeleton I made
  out of P5.js's fft object refrences in the sound library. It maps
  the volume at different pitches along the sound spectrum and graphs
  them with respect to time. Im making this because I think it would
  look pretty cool to watch while I listen to music, but it does have
  some applications in helping people to understand how computers hear
  noises.
*/

var canvasHeight = 900;
var canvasWidth = 1440;
var mic;
var fft;
var slider1 = 0.8;  //smoothing effect  
var slider2 = 1.0;
var depth = 32;
var divs = 16;//amount of divisions made along the sound spectrum
var depth = 16;
var divs = 32;//amount of divisions made along the sound spectrum
var ary = [];
var boxWidth = 20;
var boxGap = 0;
var beat;
var currTime;

function setup() {

  createCanvas(canvasWidth, canvasHeight, WEBGL);
  colorMode(HSB, 255, 255, 255);
  
  
  //create objects for the sound analysis
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(mic);
  
  //create double array
  for (i = 0; i < depth; i++) {
    ary[i] = [];
    for (j = 0; j < divs; j++) {
      ary[i][j] = 1;
    }
  }
  
  //create sliders
  slider1 = createSlider(0, 1, 0, 0.01); //smoothness
  slider2 = createSlider(1, 8, 1, 1); //listen speed

  slider1.position(10,10);
  slider2.position(20,20);
	
  currTime = millis(); //sets timer
}

function draw() {

  getAudioContext().resume();
  
  //set default parameters
  background(255);
  noStroke();
  
  //move camera angle
  rotateX((mouseY-(canvasHeight/2))/ 300);
  rotateY((mouseX-(canvasWidth/2))/ 400);
  
  translate(-divs * boxWidth/2, 0, depth * boxWidth/2);

  if(millis() - currTime >= 1000/slider2.value()){
  	analyzeTime();
    currTime = millis(); //reset timer
  }
  drawGrid();
  
}


function analyzeTime() {
  getAudioContext().resume();
  //analyze fft spectrum and smooth analysis with respect to time
  var spectrum = fft.analyze();
  fft.smooth(slider1.value());
  ary[0] = spectrum;
  for (i = depth; i > 0; i--){ //move all current spectrum data from ary[i] to ary[i+1] starting at ary[].length() and going down the I values
    ary[i] = ary[i-1];
  }
  ary[0] = spectrum; // set ary[0] to current sound spectrum
  
}

function drawGrid() {
  for (i = 0; i < depth; i++) {
    push();
    translate(0, 0, -boxWidth * i);
    for (j = 0; j < divs; j++) {
      push();
      translate(boxWidth * j, 0, 0);
      fill(map(j, 0, divs - 1, 0, 255), 200 - map(i, 0, depth, 0, 200), 255);
      if(i==0){
        fill(0, 0, map(i, 0, depth - 1, 0, 255));
        stroke(1);
      }
      box(boxWidth-boxGap, ary[i][j] + 1, boxWidth-boxGap);
      pop();
    }
    pop();
  }
}
