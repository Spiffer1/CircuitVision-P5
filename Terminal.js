/**
 * Terminals occur in a 2-D matrix. Each Terminal object knows its row and column within the grid, and also
 * its potential and what components (if any) that it is connected to.
 */
class Terminal {
    /**
     * Constructs a Terminal and instantiates a list to hold the Components the terminal
     * is connected to. Initially, this arrayList is empty. The default potential for each terminal
     * is Number.MAX_VALUE. This can be used to test whether a given terminal has been assigned
     * a new potential value.
     * @param r  The row where the terminal is located
     * @param c  The column where the terminal is located.
     */
    constructor(r, c) {
        this.row = r;
        this.col = c;
        this.connections = [];
        this.potential = Number.MAX_VALUE;
    }

    /**
     * @return  Returns true if this Terminal is connected to Component c; false otherwise.
     */
    connectedTo(c) {
        for (let aConnectedComponent of this.connections) {
            if (aConnectedComponent === c) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return  A reference to the ArrayList holding the components that the terminal is connected to
     */
    getConnections() {
        return this.connections;
    }

    /**
     * Returns an individual component that is connected to the Terminal.
     * @param i  The index of the component in the connections List to be returned
     * @return  Returns the i'th component in the connections List
     */
    getConnection(i) {
        return this.connections[i];
    }

    /**
     * Adds a component to the connections List. This method is called by the circuit's addComponent() method
     * @param c  The Component to be connected
     */
    connect(c) {
        this.connections.push(c);
    }

    /**
     * Removes the component from the connections List of this Terminal. Called by circuit's removeComponent()
     * method and implicitly by removeComponentAt() method.
     * @param c  Component: The Component to be disconnected.
     */
    disconnect(c) {
        const index = this.connections.indexOf(c);
        if (index > -1) {
            this.connections.splice(index, 1);  // removes one element starting at index
        }
    }

    /**
     * @return  The number of components this Terminal is connected to
     */
    numConnections() {
        return this.connections.length;
    }

    /**
     * @return  The row where this terminal is located
     */
    getRow() {
        return this.row;
    }

    /**
     * @return  The column where this terminal is located
     */
    getCol() {
        return this.col;
    }

    /**
     * Sets the potential at this Terminal
     * @param p  The new potential at this terminal
     */
    setPotential(p) {
        this.potential = p;
    }

    /**
     * @return  The potential at this terminal
     */
    getPotential() {
        return this.potential;
    }

    /**
     * Two Terminals are "equal" when their row and column match. Allows comparison of Terminals from
     * different circuits, using findCorrespondingComponent(), for example.
     */
    equals(other) {
        if (other !== null && this.row === other.getRow() && this.col === other.getCol()) {
            return true;
        }
        return false;
    }

    // /**
    //  * @ return Returns the x and y coordinates of the Terminal. Note: it is not in row, column order.
    //  */
    // Terminal.prototype.toString = function terminalToString() {
    //     return "(" + this.col + ", " + this.row + ")";
    // }
}
