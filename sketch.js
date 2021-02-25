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
var slider1 = 0.8;  //smoothing effect  //amount of divisionsmade along the sound spectrum
var depth = 50;
var divs = 32;
var ary = [];
var boxWidth = 15;

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  colorMode(HSB, 255, 255, 255);
  
  //create objects for the sound anaysis
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  mic.start();
  fft.setInput(mic);
  
  //create double array
  for (i = 0; i < depth; i++) {
    ary[i] = [];
    for (j = 0; j < divs; j++) {
      ary[i][j] = 1;
    }
  }
  
  //create sliders
  slider1 = createSlider(0, 1, 0, 0.01);
}

function draw() {
  
  //set default parameters
  background(255);
  noStroke();
  
  //move camera angle
  rotateX((mouseY-(canvasHeight/2))/ 300);
  rotateY((mouseX-(canvasWidth/2))/ 400);
  
  translate(-divs * boxWidth/2, 0, depth * boxWidth/2);
  
  //analyze fft spectrum and smooth analysis with respect to time
  var spectrum = fft.analyze();
  fft.smooth(slider1.value());
  getAudioContext().resume();
  
  for (i = depth; i > 0; i--){
   ary[i] = ary[i-1];
  }
  
  ary[0] = spectrum;
  
  //Draw Graph
  for (i = 0; i< spectrum.length; i++) {
    var x = map(i, 0, spectrum.length, 0, width);
    var h = map(spectrum[i], 0, 255, 0, height/2);
  
  /*push();
      translate(width/2,height/2);
      rotate(2*PI/spectrum.length*i*1.3);
      translate(100,0);
      rotate(-PI/2);
      rect(50*2*PI/spectrum.length, 0, 100*2*PI/spectrum.length, h );
    pop();*/
  }
  for (i = 0; i < depth; i++) {
    push();
    translate(0, 0, -boxWidth * i);
    for (j = 0; j < divs; j++) {
      push();
      translate(boxWidth * j, 0, 0);
      //fill(0, 0, map(i, 0, depth - 1, 0, 255));
      fill(map(j, 0, divs - 1, 0, 255), 200 - map(i, 0, depth - 1, 0, 200), 255);
      if(i==0){
        fill(0, 0, map(i, 0, depth - 1, 0, 255));
        stroke(1);
      }
      //box(boxWidth, pow(ary[i][j]/16, 2) + 1, boxWidth);
      box(boxWidth-5, ary[i][j] + 1, boxWidth-5);
      pop();
    }
    pop();
  }
  //getAudioContext().resume();
}
