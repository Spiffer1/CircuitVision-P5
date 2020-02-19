/**
 * This class is part of the View. Each terminal in the circuit schematic is represented
 * by a Dot. The number of rows and columns of Dots is set within the CircuitVisionRunner.
 */
class Dot {
    /**
     * Constructor for a new Dot, which corresponds to one terminal in the Circuit.
     * @param r  int: Row number of the Dot
     * @param c  int: Column number of the Dot
     * @param originX  int: X coordinate of the upper left dot in the matrix
     * @param originY  int: Y coordinate of the upper left dot in the matrix
     * @param spacing  int: Number of pixels between each pair of dots
     */
    constructor(r, c, originX, originY, spacing) {
        this.row = r;   // Terminal grid coordinates
        this.col = c;
        this.x = originX + c * spacing;     // Pixel coordinates
        this.y = originY + r * spacing;
    }


    /**
     * Calls methods from the P5 library to display a dot. Defaults to a black circle
     * with 5 pixel diameter.
     * @param circuit  The circuit object containing the Terminal data that this Dot displays
     * @param showValues  boolean: Determines whether voltages are displayed next to Dots
     */
    display(circuit, showValues = false) {
        circuitCanvas.stroke(0);
        circuitCanvas.fill(0);
        circuitCanvas.ellipse(this.x, this.y, 5, 5);
        if (showValues) {
            const term = circuit.getTerminal(this.row, this.col);
            let potential = term.getPotential();
            if (potential < Number.MAX_VALUE / 10) {
                potential = Math.round(potential * 1000) / 1000;     // round to nearest thousandth
                //textAlign(LEFT);
                circuitCanvas.fill(255);
                circuitCanvas.textSize(12);
                circuitCanvas.noStroke();
                circuitCanvas.text(potential.toString() + " V", this.x + 3, this.y - 8);
            }
        }
    }


    /**
     * @return Number: distance in pixels from this dot to the last mouse click.
     */
    distanceToMouse() {
        return Math.sqrt((this.x - circuitCanvas.mouseX) ** 2 + (this.y - circuitCanvas.mouseY) ** 2);
    }


    /**
     * @return  int: This dot's row.
     */
    getRow() {
        return this.row;
    }


    /**
     * @return  int: This dot's column.
     */
    getCol() {
        return this.col;
    }


    /**
     * @return Returns a string with the dot location expressed as an ordered pair (x, y).
     */
    // public String toString()
    // {
    //     return "Dot at (" + col + ", " + row + ")\n";
    // }
}
