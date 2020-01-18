/**
 * Holds the components and terminals for an electric circuit. The solve() method finds the current through
 * and voltage across each component of the circuit. Handles dead-end branches of a circuit correctly,
 * but may not work correctly if circuit fragments or more than one complete circuit are present.
 * Set the instance variable "verbose" to true to display results of intermediate calculations.
 */
class Circuit {
    /**
     * Constructs a new Circuit object with a grid of terminals with particular dimensions
     * @param row The number of rows of terminals in the circuit
     * @param col The number of columns of terminals in the circuit
     */
    constructor(row, col)
    {
        this.rows = row;
        this.cols = col;
        this.terminals = new Array(this.rows);
        this.components = [];
        this.numBranches = 0;
        this.verbose = false;

        // initialize Terminals
        for (let r = 0; r < this.rows; r++)
        {
            this.terminals[r] = new Array(this.cols);
            for (let c = 0; c < this.cols; c++)
            {
                this.terminals[r][c] = new Terminal(r, c);
            }
        }
    }

    /**
     * Adds a component to a to a specific location in a circuit. Ordinarily this is performed only when first specifying
     * the circuit. If a different component already exists at the specified location, this method has no effect.
     * Updates the endpoints of the component so that it knows what terminals it is connected to. Updates those
     * terminals so that they know they are connected to this component. If the component is a battery, this method defaults to
     * making endPoint1 the positive terminal of the battery.
     * @param c  The component to be added
     * @param r1  Endpoint 1's row
     * @param c1  Endpoint 1's column
     * @param r2 Endpoint 2's row
     * @param c2  Endpoint 2's column
     * return  True if component is successfully added to circuit; false if the component was not added
     */
    addComponent(c, r1, c1, r2, c2) {
        c.setEndPt1(this.terminals[r1][c1]);
        c.setEndPt2(this.terminals[r2][c2]);
        // Check wheter a component already exists at this location
        if (this.findCorrespondingComponent(this, c) !== null) {
            return false;
        }
        this.components.push(c);
        this.terminals[r1][c1].connect(c);
        this.terminals[r2][c2].connect(c);
        if (c instanceof Battery) {
            c.setPosEnd(this.terminals[r1][c1]);
        }
        return true;
    }

    /**
     * Like addComponent, but used only for batteries.
     * @param b  Battery: The battery to be added
     * @param r1  int: Endpoint 1's row
     * @param c1  int: Endpoint 1's column
     * @param r2 int: Endpoint 2's row
     * @param c2  int: Endpoint 2's column
     * @param posEndRow  int: Positive terminal's row
     * @param posEndCol  int: Positive terminal's column
     * return  True if component is successfully added to circuit; false if the component was not added
     */
    addBattery(b, r1, c1, r2, c2, posEndRow, posEndCol) {
        b.setEndPt1(this.terminals[r1][c1]);
        b.setEndPt2(this.terminals[r2][c2]);
        // Check wheter a component already exists at this location
        if (this.findCorrespondingComponent(this, b) !== null) {
            return false;
        }
        this.components.push(b);
        this.terminals[r1][c1].connect(b);
        this.terminals[r2][c2].connect(b);
        b.setPosEnd(this.terminals[posEndRow][posEndCol]);
        return true;
    }

    /**
     * Given a component (givenComp) in one circuit (or about to be added in one circuit),
     * this method finds the component attached to the same terminals
     * in a different circuit (circ). If there is not a component attached to the same terminals, this returns null.
     * @param circ  Circuit: The circuit you are searching in
     * @param givenComp  Component: The component from the original circuit
     * @return  Component: The component that is found connected to the same terminals as comp, but in a different circuit, circ,
     *          or null if no such component exists in circ
     */
    findCorrespondingComponent(circ, givenComp) {
        for (let comp of circ.getComponents()) {
            if ( (comp.getEndPt1().equals(givenComp.getEndPt1()) && comp.getEndPt2().equals(givenComp.getEndPt2())) || (comp.getEndPt1().equals(givenComp.getEndPt2()) && comp.getEndPt2().equals(givenComp.getEndPt1())) ) {
                return comp;
            }
        }
        return null;
    }

    /**
     * Removes a component from a given location in a circuit.  This method can be used in the process
     * of desiging a circuit. It also gets used on a copy of the original circuit while identifying independent loops.
     * @param r1  int: One endpoint's row.
     * @param c1  int: One endpoint's column
     * @param r2  int: The other endpoint's row
     * @param c2  int: The other endpoint's column
     */
    removeComponentAt(r1, c1, r2, c2) {
        const component = this.getComponent(r1, c1, r2, c2);
        this.removeComponent(component);
    }

    /**
     * Removes the given component from a circuit. This method can be used in the process
     * of desiging a circuit. It also gets used on a copy of the original circuit while identifying independent loops.
     * @param component  Component: The component to be removed.
     */
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);  // removes one element starting at index
        }
        component.getEndPt1().disconnect(component);
        component.getEndPt2().disconnect(component);
        component.setEndPt1(null);
        component.setEndPt2(null);
    }

    /**
     * Returns the component from a specified location in a circuit.
     * @param r1  int: One endpoint's row
     * @param c1  int: One endpoint's column
     * @param r2  int: The other endpoint's row
     * @param c2  int: The other endpoint's column
     * @return  Returns the component found at that location or null if no component is at that location.
     */
    getComponent(r1, c1, r2, c2) {
        for (let c of this.components) {
            if ( c.getEndPt1().equals(this.terminals[r1][c1]) && c.getEndPt2().equals(this.terminals[r2][c2]) || c.getEndPt2().equals(this.terminals[r1][c1]) && c.getEndPt1().equals(this.terminals[r2][c2]) ) {
                return c;
            }
        }
        return null;
    }

    /**
     * @param row  int: The row of the desired terminal
     * @param col  int: The column of the desired terminal.
     * @return  Terminal: Returns the teminal at the specified location.
     */
    getTerminal(row, col) {
        return this.terminals[row][col];
    }

    /**
     * @return  int: Returns the number of rows of terminals in the circuit
     */
    getRows() {
        return this.rows;
    }

    /**
     * @return  int: Returns the number of columns of terminals in the circuit
     */
    getCols() {
        return this.cols;
    }

    /**
     * @return  int: Returns the number independent branches in the circuit, excluding any branches that do not form complete circuits
     */
    getNumBranches() {
        return this.numBranches;
    }

    /**
     * @return  Terminal[]: Returns a reference to the 2D array of terminals in the circuit
     */
    getTerminals() {
        return this.terminals;
    }

    /**
     * @return  Component[]: Returns a reference to the ArrayList of components in the circuit
     */
    getComponents() {
        return this.components;
    }
}
