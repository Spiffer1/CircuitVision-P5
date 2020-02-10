class Tower {
    constructor(originX, originZ, height) {
        // (x, 0, z) is the bottom left, furthest back corner of the tower.
        this.x = originX;
        this.z = originZ;
        this.h = height;    // heights are negative, since positive y axis points downward
        this.ballsWaiting = 0;
    }

    display() {
        animationCanvas.push();
        animationCanvas.translate(this.x, 0, this.z);    // middle of bottom of tower

        animationCanvas.beginShape();
        animationCanvas.vertex(0 , 0, 0);
        animationCanvas.vertex(0, this.h, 0);
        animationCanvas.vertex(Animation.WALL_WID, this.h, 0);
        animationCanvas.vertex(Animation.WALL_WID, 0, 0);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, 0, 0);
        animationCanvas.vertex(0, this.h, 0);
        animationCanvas.vertex(0, this.h, Animation.WALL_WID);
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, this.h, Animation.WALL_WID);
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_WID, 0, Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_WID, this.h, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(Animation.WALL_WID, this.h, Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_WID, 0, Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_WID, 0, 0);
        animationCanvas.vertex(Animation.WALL_WID, this.h, 0);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, 0, 0);
        animationCanvas.vertex(Animation.WALL_WID, 0, 0);
        animationCanvas.vertex(Animation.WALL_WID, 0, Animation.WALL_WID);
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, this.h, 0);
        animationCanvas.vertex(Animation.WALL_WID, this.h, 0);
        animationCanvas.vertex(Animation.WALL_WID, this.h, Animation.WALL_WID);
        animationCanvas.vertex(0, this.h, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        if (this.ballsWaiting > 0) {
            animationCanvas.translate(Animation.WALL_WID / 2, this.h - Ball.RADIUS , Animation.WALL_WID / 2);     // middle of top of tower
            animationCanvas.sphere(Ball.RADIUS);
        }

        animationCanvas.pop();
    }

    getX() {
        return this.x;
    }

    getZ() {
        return this.z;
    }

    getHeight() {
        return this.h;
    }

    // public String toString()
    // {
    //     return "x: " + x + "\tz: " + z + "\th: " + h;
    // }

    addWaitingBall() {
        this.ballsWaiting++;
    }

    takeWaitingBall() {
        if (this.ballsWaiting > 0) {
            this.ballsWaiting--;
            return true;
        }
        return false;
    }
}
