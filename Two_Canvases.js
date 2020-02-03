// Two canvases created using P5's "Instance Mode"
// See Coding Train tutorial 9.11

const circuitSketch = function(p) {
  p.x = 0;
  p.y = 0;
  p.speedX = 1;
  p.speedY = 1.3;

  p.setup = function() {
    p.createCanvas(200, 200);
    p.createP("Demo: Creating separate 2D and 3D canvases."
            + "One canvas can access variables from the other."
            + "Here, the cube color is determined by the rectangle's position."
            + "(Upper Left: Red; Upper Right: Blue)"
            + "(Lower Left: Cyan; Lower Right: Yellow)");
  }

  p.draw = function() {
    p.background(100);
    p.fill(200, 0, 200);
    p.rect(p.x, p.y, 50, 50);
    p.x += p.speedX;
    if (p.x > p.width - 50 || p.x < 0) {
      p.speedX *= -1;
    }
    p.y += p.speedY;
    if (p.y > p.height - 50 || p.y < 0) {
      p.speedY *= -1;
    }
  }
}

let animationSketch = function(p) {

  p.setup = function() {
    p.createCanvas(200, 200, p.WEBGL);
  }

  p.draw = function() {
    p.background(200);
    let colorVal = p.map(canvas1.x, 0, canvas1.width - 50, 0, 255);
    let red = colorVal;
    let green = p.map(canvas1.y, 0, canvas1.height - 50, 0, 255);;
    let blue = 255 - colorVal;
    p.fill(red, green, blue);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.02);
    p.box(50);
  }
}

let canvas1 = new p5(circuitSketch);
let canvas2 = new p5(animationSketch);
