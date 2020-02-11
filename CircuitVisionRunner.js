/*
 * This Runner allows the user to add components to a grid of terminals
 * by clicking on a component (resistor, wire, or battery) in a palette of buttons
 * and then clicking between two dots in the grid of terminals.
 *
 * Once a complete circuit has been constructed, the user can click the "Animate Model"
 * button and an animated 3D model of the circuit will display in a second window.
 *
 * Code written by Sean Fottrell
 * November 14, 2014
 * Ported from Java and Processing to JavaScript and P5.js January, 2020.
 *
 * Concept based on CircuitVision by Benjamin Lai, circa 1992
 */

// Created using P5's "Instance Mode"
// See Coding Train tutorial 9.11

/**
 * CircuitVisionRunner is the controller class for the CircuitVision program. This class controls and displays
 * the main GUI window containing the circuit diagram and buttons that allow interaction with the program.
 *
 * Other classes in the View are "Dot", representing the terminals in the circuit diagram, and a set of
 * classes for displaying an additional window (win2) for the 3-D animation: "Animation", "Wall", "Tower",
 * "Ball", and "Wheel".
 *
 * This class and the "Animation" class use a set of Model classes, that represent the circuit components
 * and solve the circuit to find currents and potentials at each point. These classes include: "Circuit",
 * "Component" (with its sub-classes "Resistor", "Battery", and "Wire") and "Terminal".
 */

let circuit;    // Circuit: holds the circuit model
const terminalRows = 4;
const terminalCols = 4;
const gridSpacing = 80;

const animationSketchHeight = 400;
const animationSketchWidth = 500;

let scaleVolts = false;     // boolean: sets autoscaling by a toggle button
let scaleAmps = false;    // boolean
let rotationEnabled = false;    // boolean
let animating = false;

const circuitSketch = (p) => {
    p.gridX = 80;    // the x and y for the upper left terminal (Dot) on the screen
    p.gridY = 80;

    p.newAnimation;         // booleans...
    p.showVolts;
    p.showAmps;
    p.shortCircuitWarning;

    p.wireButton;         // references to buttons
    p.resistorButton;
    p.batteryButton;
    p.removeButton;
    p.showVoltsButton;
    p.showAmpsButton;
    p.animateButton;

    p.circuitMode;    // int: 1: add resistor; 2: add wire; 3: add battery; 4: remove component; 0: no mode selected

    // make 2D array to hold Dot objects (initially all null). These will be the terminals shown on the screen
    p.dots = new Array(terminalRows).fill().map(() => Array(terminalCols).fill(null));


    p.setup = () => {
        p.createCanvas(600, 400);
        p.smooth();
        p.newAnimation = false;
        animating = false;
        p.showVolts = false;
        p.showAmps = false;
        p.circuitMode = 0;
        p.shortCircuitWarning = false;


        // make new Circuit object
        circuit = new Circuit(terminalRows, terminalCols);

        p.wireButton = p.createButton("Add Wire");
        p.resistorButton = p.createButton("Add Resistor");
        p.resistorText = p.createInput("10");
        p.resistorText.size(40, 15);
        p.batteryButton = p.createButton("Add Battery");
        p.batteryText = p.createInput("6");
        p.batteryText.size(40, 15);
        p.removeButton = p.createButton("Remove Component");
        p.showVoltsButton = p.createButton("Show Volts", "off");  // arguments: text to display, button-values
        p.showAmpsButton = p.createButton("Show Amps", "off");
        p.animateButton = p.createButton("Animate 3D Model");

        p.wireButton.mousePressed(p.toggleWire);   // when button is pressed, callback function is called
        p.resistorButton.mousePressed(p.toggleResistor);
        p.batteryButton.mousePressed(p.toggleBattery);
        p.removeButton.mousePressed(p.toggleRemove);
        p.showVoltsButton.mousePressed(p.toggleShowVolts);
        p.showAmpsButton.mousePressed(p.toggleShowAmps);
        p.animateButton.mousePressed(p.animateModel);

        // Initially in "Add Battery" mode
        p.toggleBattery();



/*
// **************************  ADD TEST CIRCUIT COMPONENTS  ******************
        // this.setComponentToStrings();

        circuit.addBattery(new Battery(6), 1, 0, 2, 0, 1, 0);  // Extra two arguments set the positive end of the battery.
        circuit.addComponent(new Wire(), 1, 0, 0, 0);
        circuit.addComponent(new Wire(), 0, 0, 0, 1);
        circuit.addComponent(new Wire(), 0, 1, 0, 2);
        circuit.addComponent(new Wire(), 0, 2, 1, 2);
        circuit.addComponent(new Wire(), 1, 2, 1, 1);

        //circuit.addComponent(new Wire(), 1, 2, 1, 3);
        //circuit.addComponent(new Wire(), 1, 3, 2, 3);  // putting wire here prevents resistor being added later

        circuit.addComponent(new Resistor(10), 1, 1, 2, 1);
        circuit.addComponent(new Resistor(10), 1, 2, 2, 2);

        //circuit.addComponent(new Resistor(10), 1, 3, 2, 3);
        //circuit.addComponent(new Resistor(10), 1, 2, 1, 3);  // Adding resistor fails because wire is already there

        circuit.addComponent(new Wire(), 2, 1, 2, 2);
        circuit.addComponent(new Wire(), 2, 3, 2, 2);
        circuit.addComponent(new Wire(), 2, 2, 3, 2);
        circuit.addComponent(new Wire(), 3, 2, 3, 1);
        circuit.addComponent(new Wire(), 3, 1, 3, 0);
        circuit.addComponent(new Wire(), 3, 0, 2, 0);

        circuit.addComponent(new Wire(), 0, 2, 0, 3);       // add dangler
        circuit.addComponent(new Resistor(5), 0, 3, 1, 3);

        circuit.addComponent(new Wire(), 2, 2, 2, 3);       // another dangler

        circuit.addBattery(new Battery(5), 3, 1, 2, 1, 2, 1);  // Creates short circuit

        /*
        circuit.addComponent(new Wire(), 1, 2, 1, 3);
        circuit.addComponent(new Wire(), 0, 2, 0, 3);
        circuit.addComponent(new Resistor(5), 0, 3, 1, 3);
        circuit.addComponent(new Wire(), 0, 2, 1, 2);
        */

        //circuit.removeDangler();

        //console.log(circuit.getComponent(1, 1, 2, 1).toString());

        // const nodes = [];
        // circuit.findNodes(nodes);
        // circuit.labelBranches(nodes);

        //let currents = circuit.solve();

// ************************ FINISH ADDING TEST CIRCUIT COMPONENTS  ***********



        // Initialize dots
        for (let r = 0; r < terminalRows; r++) {
            for (let c = 0; c < terminalCols; c++){
                p.dots[r][c] = new Dot(r, c, p.gridX, p.gridY, gridSpacing);
            }
        }
    }

    p.draw = () => {
        p.background(150);
        p.drawCircuit();
    }

    // If mouse clicked in circuit area, add (or remove) component
    p.mouseClicked  = () => {
        const mX = p.mouseX;
        const mY = p.mouseY;
        if (mX >= 0 && mX < p.width && mY >= 0 && mY < p.height) {
            animating = false;
        }
        // Determine two terminals (row and column) that click was between
        let closest = p.dots[0][0];
        let nextClosest = p.dots[0][0];
        let minDist = gridSpacing;
        let minDist2 = gridSpacing;
        for (let r = 0; r < terminalRows; r++) {
            for (let c = 0; c < terminalCols; c++) {
                const dist = p.dots[r][c].distanceToMouse();
                if (dist < minDist) {
                    nextClosest = closest;
                    minDist2 = minDist;
                    closest = p.dots[r][c];
                    minDist = dist;
                }
                else if (dist < minDist2) {
                    nextClosest = p.dots[r][c];
                    minDist2 = dist;
                }
            }
        }
        const r1 = closest.getRow();
        const c1 = closest.getCol();
        const r2 = nextClosest.getRow();
        const c2 = nextClosest.getCol();
        // Add component to circuit model
        if (minDist < gridSpacing && minDist2 < gridSpacing) {
            // get component between those terminals (null if none)
            const c = circuit.getComponent(r1, c1, r2, c2);
            if (c !== null && p.circuitMode === 4) {
                circuit.removeComponent(c);
            }
            else if (c !== null) {
                if (c instanceof Resistor) {
                    const r = Number(p.resistorText.value());
                    if (r > 0) {
                        c.setResistance(r);
                        // ((Toggle)cp5.getController("showVolts")).setState(false);
                        // ((Toggle)cp5.getController("showAmps")).setState(false);
                        // ((Toggle)cp5.getController("animateModel")).setState(false);
                    }
                }
                if (c instanceof Battery) {
                    if (minDist2 - minDist < gridSpacing / 3) {  // If you click near the middle of the battery...
                        const v = Number(p.batteryText.value());
                        if (v > 0) {
                            c.setVoltage(v);
                            //         ((Toggle)cp5.getController("showVolts")).setState(false);
                            //         ((Toggle)cp5.getController("showAmps")).setState(false);
                            //         ((Toggle)cp5.getController("animateModel")).setState(false);
                        }

                    }
                    else {   // If you click near the end of the battery...
                        c.setPosEnd(circuit.getTerminal(r1, c1));    // ...that end becomes the positive terminal
                    }
                }
            }
            else if (c === null) {
                if (p.circuitMode === 1) {
                    const r = Number(p.resistorText.value());
                    if (r <= 0) {
                        r = 10;
                    }
                    circuit.addComponent(new Resistor(r), r1, c1, r2, c2);
                }
                if (p.circuitMode === 2) {
                    circuit.addComponent(new Wire(), r1, c1, r2, c2);
                }
                if (p.circuitMode === 3) {
                    const v = Number(p.batteryText.value());
                    if (v <= 0) {
                        v = 6;
                    }
                    circuit.addBattery(new Battery(v), r1, c1, r2, c2, r1, c1);  // pos end is dot closest to click
                }
            }
        }
    }

    p.drawCircuit = () => {
        // Draw terminals
        for (let row = 0; row < terminalRows; row++) {
            for (let col = 0; col < terminalCols; col++) {
                if (p.showVolts) {
                    circuitCanvas.textAlign(circuitCanvas.LEFT);
                }
                p.dots[row][col].display(circuit, p.showVolts);
            }
        }
        // Draw Components
        for (let c of circuit.getComponents()) {
            const x1 = p.gridX + c.getEndPt1().getCol() * gridSpacing;
            const y1 = p.gridY + c.getEndPt1().getRow() * gridSpacing;
            const x2 = p.gridX + c.getEndPt2().getCol() * gridSpacing;
            const y2 = p.gridY + c.getEndPt2().getRow() * gridSpacing;
            if (c instanceof Wire) {
                p.stroke(0);
                p.line(x1, y1, x2, y2);
            }
            else if (c instanceof Resistor) {
                if (y1 === y2) {  // horizontal resistor
                    const startX = Math.min(x1, x2) + (gridSpacing - 26) / 2;
                    // Display Resistance
                    p.textAlign(p.CENTER);
                    p.textSize(14);
                    p.noStroke();
                    p.fill(0);
                    p.text(c.getResistance(), startX + 13, y1 - 10);

                    // Draw resistor
                    p.stroke(0);
                    p.line(startX, y1, startX + 3, y1 - 5);
                    p.line(startX + 3, y1 - 5, startX + 8, y1 + 5);
                    p.line(startX + 8, y1 + 5, startX + 13, y1 - 5);
                    p.line(startX + 13, y1 - 5, startX + 18, y1 + 5);
                    p.line(startX + 18, y1 + 5, startX + 23, y1 - 5);
                    p.line(startX + 23, y1 - 5, startX + 26, y1);
                    p.line(Math.min(x1, x2), y1, startX, y1);
                    p.line(Math.max(x1, x2), y1, startX + 26, y1);
                }
                else {   // vertical resistor
                    const startY = Math.min(y1, y2) + (gridSpacing - 26) / 2;
                    p.textAlign(p.RIGHT);
                    p.textSize(14);
                    p.noStroke();
                    p.fill(0);
                    p.text(c.getResistance(), x1 - 8, startY + 17);
                    p.stroke(0);
                    p.line(x1, startY, x1 - 5, startY + 3);
                    p.line(x1 - 5, startY + 3, x1 + 5, startY + 8);
                    p.line(x1 + 5, startY + 8, x1 - 5, startY + 13);
                    p.line(x1 - 5, startY + 13, x1 + 5, startY + 18);
                    p.line(x1 + 5, startY + 18, x1 - 5, startY + 23);
                    p.line(x1 - 5, startY + 23, x1, startY + 26);
                    p.line(x1, Math.min(y1, y2), x1, startY);
                    p.line(x1, Math.max(y1, y2), x1, startY + 26);
                }
            }
            else if (c instanceof Battery) {
                p.push();
                // translate to middle of battery and rotate to get pos end on right
                if (y1 === y2) {  // horizontal battery
                    const x0 = Math.min(x1, x2);
                    p.translate(x0 + gridSpacing / 2, y1);

                    p.textAlign(p.CENTER);
                    p.textSize(14);
                    p.noStroke();
                    p.fill(0);
                    p.text(c.getVoltage(), 0, -12 );

                    if (Math.min(c.getEndPt1().getCol(), c.getEndPt2().getCol()) === c.getPosEnd().getCol()) {
                        p.rotate(p.PI);
                    }
                }
                else {   // vertical battery
                    const y0 = Math.min(y1, y2);
                    p.translate(x1, y0 + gridSpacing / 2);

                    p.textAlign(p.RIGHT);
                    p.textSize(14);
                    p.noStroke();
                    p.fill(0);
                    p.text(c.getVoltage(), -11, 4 );

                    if (Math.min(c.getEndPt1().getRow(), c.getEndPt2().getRow()) === c.getPosEnd().getRow()) {
                        p.rotate(-p.PI / 2);
                    }
                    else {
                        p.rotate(p.PI / 2);
                    }
                }
                // draw battery
                p.stroke(0);
                p.line(-gridSpacing / 2, 0, -3, 0);
                p.line(3, 0, gridSpacing / 2, 0);
                p.line(-3, -4, -3, 4);
                p.line(3, -8, 3, 8);
                p.pop();
            }
            // Show current
            if (p.showAmps && Math.abs(c.getCurrent()) > .00000001) {
                let end1Arrow = true;     // arrow end closer to EndPoint1
                let biggerEnd2 = 1;   // = -1 if x1 > x2
                let left = 1;   // if left = -1: arrow points right/down; if left = 1, arrow points left/up
                if (c.getCurrentDirection().equals(c.getEndPt2())) {
                    end1Arrow = !end1Arrow;
                    left *= -1;
                }
                if (x1 > x2 || y1 > y2) {
                    biggerEnd2 *= -1;
                    left *=-1;
                }
                if (c.getCurrent() < 0) {
                    end1Arrow = !end1Arrow;
                    left *= -1;
                }
                p.stroke(255);
                p.fill(255);
                p.textSize(12);
                let current = Math.abs(c.getCurrent());
                current = Math.round(current * 10000) / 10000;   // 4 decimal places on current
                if (y1 === y2) {  // a horizontal component
                    // Draw current arrow
                    p.line(x1 + biggerEnd2 * 25, y1 + 10, x2 - biggerEnd2 * 25, y1 + 10);
                    if (end1Arrow) {
                        p.line(x1 + left * 25, y1 + 10, x1 + left * 28, y1 + 13);
                        p.line(x1 + left * 25, y1 + 10, x1 + left * 28, y1 + 7);
                    }
                    else {
                        p.line(x2 + left * 25, y1 + 10, x2 + left * 28, y1 + 13);
                        p.line(x2 + left * 25, y1 + 10, x2 + left * 28, y1 + 7);
                    }
                    // Display number of amps
                    p.textAlign(p.CENTER);
                    p.noStroke();
                    p.text(current + " A", (x1 + x2) / 2, y1 + 23 );
                }
                else {   // a vertical component
                    // Draw current arrow
                    p.line(x1 + 10, y1 + biggerEnd2 * 25, x1 + 10, y2 - biggerEnd2 * 25);
                    if (end1Arrow) {
                        p.line(x1 + 10, y1 + left * 25, x1 + 7, y1 + left * 28);
                        p.line(x1 + 10, y1 + left * 25, x1 + 13, y1 + left * 28);
                    }
                    else {
                        p.line(x2 + 10, y2 + left * 25, x2 + 7, y2 + left * 28);
                        p.line(x2 + 10, y2 + left * 25, x2 + 13, y2 + left * 28);
                    }
                    // Display number of amps
                    p.textAlign(p.LEFT);
                    p.noStroke();
                    p.text(current + " A", x1 + 13, (y1 + y2) / 2 + 5 );
                }
            }
        }
        if (p.shortCircuitWarning) {
            p.textSize(18);
            p.noStroke();
            p.fill(255, 0, 0);
            p.textAlign(p.LEFT);
            p.text("Short Circuit or Incomplete Circuit!", 150, 150);
        }
    }

    // The following are callback functions defining button functionalities
    p.toggleWire = () => {
        if (p.shortCircuitWarning) {
            p.shortCircuitWarning = false;
        }
        p.showVolts = false;
        p.showAmps = false;
        p.circuitMode = 2;
        p.wireButton.style("background-color", "green");    // changes css style
        p.resistorButton.style("background-color", "white");
        p.batteryButton.style("background-color", "white");
        p.removeButton.style("background-color", "white");
    }

    p.toggleResistor = () => {
        if (p.shortCircuitWarning) {
            p.shortCircuitWarning = false;
        }
        p.showVolts = false;
        p.showAmps = false;
        p.circuitMode = 1;
        p.wireButton.style("background-color", "white");
        p.resistorButton.style("background-color", "green");
        p.batteryButton.style("background-color", "white");
        p.removeButton.style("background-color", "white");
    }

    p.toggleBattery = () => {
        if (p.shortCircuitWarning) {
            p.shortCircuitWarning = false;
        }
        p.showVolts = false;
        p.showAmps = false;
        p.circuitMode = 3;
        p.wireButton.style("background-color", "white");
        p.resistorButton.style("background-color", "white");
        p.batteryButton.style("background-color", "green");
        p.removeButton.style("background-color", "white");
    }

    p.toggleRemove = () => {
        if (p.shortCircuitWarning) {
            p.shortCircuitWarning = false;
        }
        p.showVolts = false;
        p.showAmps = false;
        p.circuitMode = 4;
        p.wireButton.style("background-color", "white");
        p.resistorButton.style("background-color", "white");
        p.batteryButton.style("background-color", "white");
        p.removeButton.style("background-color", "green");
    }

    p.toggleShowVolts = () => {
        if (p.showVoltsButton.value() === "off") {
            p.showVoltsButton.value("on");
            p.showVoltsButton.html("Hide Volts");
            circuitMode = 0;
            p.wireButton.style("background-color", "white");
            p.resistorButton.style("background-color", "white");
            p.batteryButton.style("background-color", "white");
            p.removeButton.style("background-color", "white");
            const currents = circuit.solve();
            if (currents === null) {
                animating = false;
                p.showVolts = false;
                //((Toggle)cp5.getController("showVolts")).setState(false);
                p.shortCircuitWarning = true;
            }
            else {
                p.showVolts = true;
            }
        }
        else {
            p.showVoltsButton.value("off");
            p.showVoltsButton.html("Show Volts");
            p.showVolts = false;
        }
    }

    p.toggleShowAmps = () => {
        if (p.showAmpsButton.value() === "off") {
            p.showAmpsButton.value("on");
            p.showAmpsButton.html("Hide Amps");
            circuitMode = 0;
            p.wireButton.style("background-color", "white");
            p.resistorButton.style("background-color", "white");
            p.batteryButton.style("background-color", "white");
            p.removeButton.style("background-color", "white");
            const currents = circuit.solve();
            if (currents === null) {
                animating = false;
                p.showAmps = false;
                //((Toggle)cp5.getController("showVolts")).setState(false);
                p.shortCircuitWarning = true;
            }
            else {
                p.showAmps = true;
            }
        }
        else {
            p.showAmpsButton.value("off");
            p.showAmpsButton.html("Show Amps");
            p.showAmps = false;
        }

    }

    p.animateModel = () => {
        circuitMode = 0;
        p.wireButton.style("background-color", "white");
        p.resistorButton.style("background-color", "white");
        p.batteryButton.style("background-color", "white");
        p.removeButton.style("background-color", "white");
        const currents = circuit.solve();
        console.log("Currents: " + currents);
        if (currents === null) {
            animating = false;
            //((Toggle)cp5.getController("showAmps")).setState(false);
            p.shortCircuitWarning = true;
        }
        else  {
            p.newAnimation = true;
            animating = true;
        }
    }
}



const animationSketch = (p) => {
    p.anim; // object of type Animation

    p.setup = () => {
        p.createCanvas(animationSketchWidth, animationSketchHeight, p.WEBGL);
        p.lights();
        p.stroke(0);
        p.frameRate(30);
        //p.sphereDetail(6); // use two parameters when creating sphere, destailX and detailY
    }

    p.draw = () => {
        //background(100);
        if (animating) {
            if (circuitCanvas.newAnimation) {
                p.anim = new Animation(circuit, gridSpacing, terminalRows, terminalCols, scaleVolts, scaleAmps, rotationEnabled);
                circuitCanvas.newAnimation = false;
            }
            p.ortho();
            p.background(100);
            p.fill(255);
            p.anim.displayAnimation();
            //redraw();
        }
    }
}



let circuitCanvas = new p5(circuitSketch);
let animationCanvas = new p5(animationSketch);
