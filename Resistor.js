/**
 * Components that are purely resistive.
 */
class Resistor extends Component {
    /**
     * Constructor sets the resistance to the specified value.
     * @param resist  Resistance of the resistor in ohms
     */
    constructor(resist) {
        super();
        this.resistance = resist;
    }

    // /**
    //  * @return Adds to the component's toString() the resistance value
    //  */
    // Resistor.prototype.toString = function resistorToString() {
    //     return super.toString() + "Resistor " + resistance + " ohms\t";
    // }
}
