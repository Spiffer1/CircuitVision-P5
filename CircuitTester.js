let circuit;    // holds the circuit model (type Circuit)
const terminalRows = 4;
const terminalCols = 4;
const gridX = 200;    // the x and y for the upper left terminal (Dot) on the screen
const gridY = 100;
const gridSpacing = 80;

function setup() {
    circuit = new Circuit(4, 4);

    circuit.addBattery(new Battery(6), 1, 0, 2, 0, 1, 0);  // Extra two arguments set the positive end of the battery.
    circuit.addComponent(new Wire(), 1, 0, 0, 0);
    circuit.addComponent(new Wire(), 0, 0, 0, 1);
    circuit.addComponent(new Wire(), 0, 1, 0, 2);
    circuit.addComponent(new Wire(), 0, 2, 1, 2);
    circuit.addComponent(new Wire(), 1, 2, 1, 1);

    circuit.addComponent(new Wire(), 1, 2, 1, 3);
    //circuit.addComponent(new Wire(), 1, 3, 2, 3);
    
    circuit.addComponent(new Resistor(10), 1, 1, 2, 1);
    circuit.addComponent(new Resistor(10), 1, 2, 2, 2);

    circuit.addComponent(new Resistor(10), 1, 3, 2, 3);
    //circuit.addComponent(new Resistor(10), 1, 2, 1, 3);

    circuit.addComponent(new Wire(), 2, 1, 2, 2);
    circuit.addComponent(new Wire(), 2, 3, 2, 2);
    circuit.addComponent(new Wire(), 2, 2, 3, 2);
    circuit.addComponent(new Wire(), 3, 2, 3, 1);
    circuit.addComponent(new Wire(), 3, 1, 3, 0);
    circuit.addComponent(new Wire(), 3, 0, 2, 0);
}

function draw() {

}
