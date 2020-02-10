class Ball {
    constructor(wall, initX) {
        this.myWall = wall;
        this.x = initX;
    }

    static get RADIUS() {
        return 4;
    }

    move() {
        this.x += Animation.SPEED * this.myWall.getCurrent() * Animation.BALLS_PER_WALL / this.myWall.getMaxBalls();
    }

    display() {
        animationCanvas.push();
        // translate to coordinates of center of top of t1
        let height;
        const h1 = this.myWall.getT1().getHeight();
        const h2 = this.myWall.getT2().getHeight();
        if (this.x < Animation.WALL_WID / 2) {
            height = h1;
        }
        else if (this.x > Animation.WALL_LEN + Animation.WALL_WID / 2) {
            height = h2;
        }
        else {
            height = h1 + Math.floor((h2 - h1) * (this.x - Animation.WALL_WID/2.0) / Animation.WALL_LEN); // previously used cast to int; is Math.floor() even necessary here?
        }
        animationCanvas.translate(this.myWall.getT1().getX() + Animation.WALL_WID/2, height, this.myWall.getT1().getZ() + Animation.WALL_WID/2);

        // rotate so current is running left to right.
        if (this.myWall.getT1().getZ() > this.myWall.getT2().getZ()) {
            animationCanvas.rotateY(animationCanvas.PI / 2);
        }
        else if (this.myWall.getT1().getX() > this.myWall.getT2().getX()) {
            animationCanvas.rotateY(animationCanvas.PI);
        }
        else if (this.myWall.getT1().getZ() < this.myWall.getT2().getZ()) {
            animationCanvas.rotateY(3 * animationCanvas.PI / 2);
        }
        // draw sphere at appropriate height (tower or wall height)
        animationCanvas.translate(this.x, -Ball.RADIUS, 0);
        animationCanvas.sphere(Ball.RADIUS);

        // draw Ski lifts to push balls through batteries
        if (this.myWall.getPosEnd() !== null) {    // if this wall is a Battery...
            //Draw elevator (box) behind sphere
            if ( this.myWall.getT2() === this.myWall.getPosEnd() ) { // if positive Terminal is on the right...
                animationCanvas.translate(-Ball.RADIUS, 0, 0);
            }
            else {       // if positive terminal is on the left...
                animationCanvas.translate(Ball.RADIUS, 0, 0);
            }
            animationCanvas.box( 5, 1.5 * Ball.RADIUS, 1.5 * Ball.RADIUS );   // removed casts to ints
        }
        animationCanvas.pop();
    }

    getX() {
        return this.x;
    }
}
