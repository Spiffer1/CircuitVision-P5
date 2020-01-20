let circuit;    // holds the circuit model (type Circuit)
const terminalRows = 4;
const terminalCols = 4;
const gridX = 200;    // the x and y for the upper left terminal (Dot) on the screen
const gridY = 100;
const gridSpacing = 80;

function setup() {
    circuit = new Circuit(4, 4);

    this.setComponentToStrings();

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

/*
    circuit.addComponent(new Wire(), 1, 2, 1, 3);
    circuit.addComponent(new Wire(), 0, 2, 0, 3);
    circuit.addComponent(new Resistor(5), 0, 3, 1, 3);
    circuit.addComponent(new Wire(), 0, 2, 1, 2);
*/

    //circuit.removeDangler();

    //console.log(circuit.getComponent(1, 1, 2, 1).toString());

    const nodes = [];
    circuit.findNodes(nodes);
    circuit.labelBranches(nodes);

}

function draw() {

}

function setComponentToStrings() {
    // Override default toString() methods  (Possibly move to CircuitVisionRunner or CircuitVisionTester so they only execute once)
    Terminal.prototype.toString = function terminalToString() {
        return "(" + this.col + ", " + this.row + ")";
    }
    Battery.prototype.toString = function batteryToString() {
        let result = "";
        if (this.endPt1 !== null) {
            result += "(" + this.endPt1.getCol() + ", " + this.endPt1.getRow() + ") to ";
        }
        else {
            result += "null to ";
        }
        if (this.endPt2 !== null) {
            result += "(" + this.endPt2.getCol() + ", " + this.endPt2.getRow() + ")  ";
        }
        else {
            result += "null  ";
        }
        result += "Current Direction: " + this.getCurrentDirection() + "  ";
        result += "Current: " + this.getCurrent() + "  ";
        result += "Battery " + this.battVoltage + " V    Pos. End " + this.getPosEnd() + "\t";
        return result;
    }
    Wire.prototype.toString = function wireToString() {
        let result = "";
        if (this.endPt1 !== null) {
            result += "(" + this.endPt1.getCol() + ", " + this.endPt1.getRow() + ") to ";
        }
        else {
            result += "null to ";
        }
        if (this.endPt2 !== null) {
            result += "(" + this.endPt2.getCol() + ", " + this.endPt2.getRow() + ")  ";
        }
        else {
            result += "null  ";
        }
        result += "Current Direction: " + this.getCurrentDirection() + "  ";
        result += "Current: " + this.getCurrent() + "  ";
        result += "Wire\t\t";
        return result;
    }
    Resistor.prototype.toString = function resistorToString() {
        let result = "";
        if (this.endPt1 !== null) {
            result += "(" + this.endPt1.getCol() + ", " + this.endPt1.getRow() + ") to ";
        }
        else {
            result += "null to ";
        }
        if (this.endPt2 !== null) {
            result += "(" + this.endPt2.getCol() + ", " + this.endPt2.getRow() + ")  ";
        }
        else {
            result += "null  ";
        }
        result += "Current Direction: " + this.getCurrentDirection() + "  ";
        result += "Current: " + this.getCurrent() + "  ";
        result += "Resistor " + this.resistance + " ohms\t";
        return result;
    }
}
