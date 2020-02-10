class Wheel {
    constructor(current_) {
        this.angle = 0;
        this.current = current_;    // Current will be negative or positive to make wheel spin the right direction
    }

    static get RADIUS() {
        return 12;
    }

    display() {
        animationCanvas.fill(160);
        animationCanvas.translate(0, -Wheel.RADIUS, 0);
        animationCanvas.rotateY(-animationCanvas.PI/2);
        animationCanvas.rectMode(animationCanvas.CENTER);
        animationCanvas.rotateX(this.angle);
        animationCanvas.rect(0, 0, Wheel.RADIUS, 2 * Wheel.RADIUS);
        animationCanvas.rotateX(2 * animationCanvas.PI/3);
        animationCanvas.rect(0, 0, Wheel.RADIUS, 2 * Wheel.RADIUS);
        animationCanvas.rotateX(2 * animationCanvas.PI/3);
        animationCanvas.rect(0, 0, Wheel.RADIUS, 2 * Wheel.RADIUS);
    }

    turn() {
        this.angle -= Animation.SPEED * this.current / 10;
    }
}
