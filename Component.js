/**
 * All components (Resistors, Wires, Batteries, etc.) that can be placed between two terminals
 * are subclasses of Component. When a component is added to a circuit, its endPt variables
 * are assigned Terminals.
 */
class Component {
    /**
     * This constructor is called by all Component supclasses. When a component is added to a circuit,
     * it's endPt1 and endPt2 fields are set to the terminals at either end. The default resistance,
     * current, and voltage are set to 0. Branch is set to -1, and remains so until labelBranches()
     * is called by the circuit's solve() method.
     */
    constructor() {
        this.endPt1 = null;    // Terminals at either end of the component
        this.endPt2 = null;
        this.currentDirection = null; // this will equal either endPt1 or endPt2. Current flows from
                                      // the other end, through component, and toward this terminal.
        this.resistance = 0;
        this.current = 0.0;
        this.branch = -1;
    }

    /**
     * Accessor method called by the circuit's addComponent() method to set the component's endpoints.
     * @param terminal  The terminal connected to one end of the component.
     */
    setEndPt1(terminal) {
        this.endPt1 = terminal;
    }

    /**
     * Setter method called by the circuit's addComponent() method to set the component's endpoints.
     * @param p  The terminal connected to the other end of the component.
     */
    setEndPt2(terminal) {
        this.endPt2 = terminal;
    }

    /**
     * @return the Terminal at one end of the component.
     */
    getEndPt1() {
        return this.endPt1;
    }

    /**
     * @return the Terminal at the other end of the component.
     */
    getEndPt2() {
        return this.endPt2;
    }

    /**
     * @return  The component's resistance, which should be 0 for batteries and wires.
     */
    getResistance() {
        return this.resistance;
    }

    /**
     *  Sets a component's resistance. Used as components are added to a circuit.
     */
    setResistance(r) {
        this.resistance = r;
    }

    /**
     * After a circuit has been solved, this method is used to update the components' currents.
     */
    setCurrent(i) {
        this.current = i;
    }

    /**
     * @return  the current passing through the component, as determined by solve().
     */
    getCurrent() {
        return this.current;
    }

    /**
     * Called by labelBranches() as part of the solve() method. The branch number corresponds to a current
     * variable: currents[branch].
     */
    setBranch(b) {
        this.branch = b;
    }

    /**
     * @return  Which branch this component is a part of, and thus which current (current[branch])
     * is traveling through this component
     */
    getBranch() {
        return this.branch;
    }

    /**
     * Current direction through a component is specified by identifying the terminal at one end. The current
     * flows from the other end, through the component, and then through the currentDirection end.
     * Current directions are set at the same time branches are labeled within the solve() method.
     * @param endPt  The terminal at the end of the component where current exits the component
     */
    setCurrentDirection(endPt) {
        this.currentDirection = endPt;
    }

    /**
     * @return  The terminal at the end of the component where current exits the component
     */
    getCurrentDirection() {
        return this.currentDirection;
    }

    /**
     * @return true if both "this" component and "other" are connected between the same terminals,
     * are both the same component sub-class, and have same value for Resistance or Voltage (if a battery).
     */
    equals(other) {
        if (this.endPt1 === null || other.getEndPt1() === null) {
            return false;
        }
        if (this.endPt1.equals(other.getEndPt1()) && this.endPt2.equals(other.getEndPt2()) || this.endPt1.equals(other.getEndPt2()) && this.endPt2.equals(other.getEndPt1())) {
            if (this instanceof Wire && other instanceof Wire) {
                return true;
            }
            else if (this instanceof Resistor && other instanceof Resistor && this.resistance === other.getResistance()) {
                return true;
            }
            else if ( this instanceof Battery && other instanceof Battery && this.getVoltage() === other.getVoltage() && this.getPosEnd().equals(other.getPosEnd()) ) {
                return true;
            }
        }
        return false;
    }
}
