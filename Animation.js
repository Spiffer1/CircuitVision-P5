/**
 * Activated by CircuitVisionRunner: When the AnimateModel button is clicked,
 * the circuit is solved and the "animating" and "newAnimation" flags are set
 * to true. The latter flag results in an object of type Animation be instantiated.
 *
 * The Animation object's job is primarily to create instances of "Wall"s, "Tower"s, "Ball"s,
 * and "Wheel"s.
 */

// The following constants locate and scale the animation within its window
let ORIGIN_X; // set within displayAnimation() to keep model centered
let ORIGIN_Y; // set within displayAnimation()
const ORIGIN_Z = -100;
let VOLT_SCALE = 10;    // Can be set to different value if in constructor if autoscaling
const WALL_WID = 16;
let WALL_LEN;     // defaults to gridSpacing - WALL_WID
const BALLS_PER_WALL = 3;   // number of balls on a level wall (wire); there may be more on a sloped wall
let SPEED = .5; // scale factor for ball speed and water wheel speed

class Animation {
    constructor(circ, terminalSpacing, terminalRows, terminalCols) {
        this.circuit = circ;
        this.towers = [];
        this.walls = [];
        this.gridSpacing = terminalSpacing;
        WALL_LEN = this.gridSpacing - WALL_WID;
        this.numRows = terminalRows;
        this.numCols = terminalCols;
        // this.rotationEnabled = rotatable;

        // Construct arrayList of Towers
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                const term = this.circuit.getTerminal(row, col);
                // construct tower if the terminal is connected to anything
                if (term.getConnections().length > 0) {
                    this.towers.push(new Tower(this.getTermX(term), this.getTermZ(term), this.getTermHeight(term)));
                }
            }
        }

        // Construct arrayList of Walls
        for (let c of this.circuit.getComponents()) {
            // Set downstream end of component to term2 and upstream end to term1
            let term1 = c.getEndPt1();
            let term2 = c.getEndPt2();
            const current = c.getCurrent();
            if (term1.equals(c.getCurrentDirection()) && current > 0 || term2.equals(c.getCurrentDirection()) && current < 0) {
                term1 = c.getEndPt2();
                term2 = c.getEndPt1();
            }
            this.walls.push(new Wall(this.findTowerAtLocation(term1.getRow(), term1.getCol()), this.findTowerAtLocation(term2.getRow(), term2.getCol()), current));
        }

        // Construct balls on each wall
        for (let wall of this.walls) {
            // Add more balls per wall if wall is sloped significantly to keep ball density constant
            const height = wall.getT1().getHeight() - wall.getT2().getHeight();
            const wallLength = Math.sqrt(height * height + (WALL_LEN + WALL_WID) * (WALL_LEN + WALL_WID));
            const numBalls = Math.floor(BALLS_PER_WALL * wallLength / (WALL_LEN + WALL_WID));
            wall.setMaxBalls(numBalls);
            for (let i = 0; i < numBalls; i++) {
                wall.addNewBall(i * (WALL_LEN + WALL_WID) / numBalls);
            }
        }

        // Construct water wheels for each resistor and SkiLift for each battery
        for (let c of this.circuit.getComponents()) {
            if (c instanceof Resistor || c instanceof Battery) {
                // Find corresponding wall
                const t1 = this.findTowerAtLocation(c.getEndPt1().getRow(), c.getEndPt1().getCol());
                const t2 = this.findTowerAtLocation(c.getEndPt2().getRow(), c.getEndPt2().getCol());
                for (let w of this.walls) {
                    if (w.getT1() === t1 && w.getT2() === t2 || w.getT2() === t1 && w.getT1() === t2) {
                        if (c instanceof Resistor) {
                            w.addWheel();
                        }
                        else {
                            const posEnd = this.findTowerAtLocation( c.getPosEnd().getRow(), c.getPosEnd().getCol() );
                            w.addSkiLift(posEnd);
                        }
                        break;
                    }
                }
            }
        }
    }

    static get ORIGIN_X() {  // set within displayAnimation() to keep model centered
        return ORIGIN_X;
    }

    static get ORIGIN_Y() {  // set within displayAnimation()
        return ORIGIN_Y;
    }

    static get ORIGIN_Z() {
        return ORIGIN_Z
    }

    static get VOLT_SCALE() {
        return VOLT_SCALE;
    }

    static get WALL_WID() {
        return WALL_WID;
    }

    static get WALL_LEN() {   // defaults to gridSpacing - WALL_WID
        return WALL_LEN;
    }

    static get BALLS_PER_WALL() {   // number of balls on a level wall (wire); there may be more on a sloped wall
        return BALLS_PER_WALL;
    }

    static get SPEED() {   // scale factor for ball speed and water wheel speed
        return SPEED;
    }

    displayAnimation() {
        ORIGIN_X = -animationCanvas.width / 4;
        ORIGIN_Y = 0;
        animationCanvas.translate(ORIGIN_X, ORIGIN_Y, ORIGIN_Z);
        animationCanvas.rotateX(-animationCanvas.PI / 6);

        //Translate to center of Animation window and then rotate around y axis
        animationCanvas.translate(this.gridSpacing * (this.numCols - 1) / 2, 0, this.gridSpacing * (this.numRows - 1) / 2);
        if (rotationEnabled) {
            // Enable rotation of the animation by moving mouse over its window
            animationCanvas.rotateY(animationCanvas.map(animationCanvas.mouseX, 0, animationCanvas.width, -animationCanvas.PI*2.2, -animationCanvas.PI/6));
        }
        else {
            animationCanvas.rotateY(-animationCanvas.PI / 6);   // standard viewing angle if not using mouse rotation
        }
        animationCanvas.translate( -this.gridSpacing * (this.numCols - 1) / 2, 0, -this.gridSpacing * (this.numRows - 1) / 2 );

        for (let t of this.towers) {
            t.display();
        }
        for (let w of this.walls) {
            w.display();
            w.updateBalls();
        }
    }

    findTowerAtLocation(row, col) {
        for (let tower of this.towers) {
            if (tower.getX() === col * this.gridSpacing && tower.getZ() === row * this.gridSpacing) {
                return tower;
            }
        }
        return null;
    }

    getTermX(terminal) {
        return terminal.getCol() * this.gridSpacing;
    }

    getTermHeight(terminal) {
        return -1 * terminal.getPotential() * VOLT_SCALE;   // original code truncated to int
    }

    getTermZ(terminal) {
        return terminal.getRow() * this.gridSpacing;
    }
}
