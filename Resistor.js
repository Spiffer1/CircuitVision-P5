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
}
