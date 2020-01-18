/**
 * Batteries provide a voltage and are assumed to have no internal resistance. One terminal
 * is marked as the positiveEnd.
 */
class Battery extends Component
{
    /**
     * Constructs a Battery with the specified voltage.
     * @param volts  Voltage of the battery
     */
    constructor(volts) {
        super();
        this.positiveEnd = null;
        this.battVoltage = volts; // always positive
    }

    /**
     * Mutator to set which end of a battery is the positive terminal.
     * @param posTerminal  The Terminal connected to the positive end of the battery.
     */
    setPosEnd(posTerminal) {
        this.positiveEnd = posTerminal;
    }

    /**
     * @return  Returns the Terminal connected to the positive end of the battery
     */
    getPosEnd() {
        return this.positiveEnd;
    }

    /**
     * @param  Voltage across a component.
     */
    setVoltage(v) {
        this.battVoltage = v;
    }

    /**
     * Accessor for a battery's voltage.
     * @return  Voltage across the component.
     */
    getVoltage() {
        return this.battVoltage;
    }

    // /**
    //  * @return  Returns the Component's toString() with the battery's voltage and positive end appended
    //  */
    // Battery.prototype.toString = function batteryToString() {
    //     return super.toString() + "Battery " + this.battVoltage + " V   Pos. End " + getPosEnd() + "\t";
    // }
}
