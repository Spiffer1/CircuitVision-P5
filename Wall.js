/**
 * Part of the View. A Wall is drawn in the 3D Animation for each component in the circuit.
 */
 class Wall {
     constructor(upstreamTower, downstreamTower, current_) {
         this.t1 = upstreamTower;
         this.t2 = downstreamTower;
         // Determine which tower is far and which is near.
         this.farTower = this.t1;
         this.nearTower = this.t2;
         if (this.farTower.getZ() > this.nearTower.getZ() || this.farTower.getX() > this.nearTower.getX()) {
             this.farTower = this.t2;
             this.nearTower = this.t1;
         }
         this.current = Math.abs(current_);
         this.readyForBall = false;
         this.balls = [];
         this.maxBalls = Animation.BALLS_PER_WALL;
         this.myWheel = null;
         this.batteryPosEnd = null; // a Tower
     }

     display() {
        animationCanvas.fill(255);
        animationCanvas.push();

        //translate to that tower's (x, z), but to the middle of tower instead of its corner
        animationCanvas.translate(this.farTower.getX() + Animation.WALL_WID, 0, this.farTower.getZ());

        // if necessary, rotateY(PI/2) and translate over by wallWidth
        if (this.farTower.getZ() !== this.nearTower.getZ()) {
            animationCanvas.rotateY(-1 * animationCanvas.PI/2);
            animationCanvas.translate(Animation.WALL_WID, 0, 0);
        }

        // draw wall starting at left/back tower.
        animationCanvas.beginShape();
        animationCanvas.vertex(0, 0, 0);
        animationCanvas.vertex(0, this.farTower.getHeight(), 0);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), 0);
        animationCanvas.vertex(Animation.WALL_LEN, 0, 0);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(Animation.WALL_LEN, 0, 0);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), 0);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_LEN, 0, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(Animation.WALL_LEN, 0, Animation.WALL_WID);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), Animation.WALL_WID);
        animationCanvas.vertex(0, this.farTower.getHeight(), Animation.WALL_WID);
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);


        animationCanvas.beginShape();
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.vertex(0, this.farTower.getHeight(), Animation.WALL_WID);
        animationCanvas.vertex(0, this.farTower.getHeight(), 0);
        animationCanvas.vertex(0, 0, 0);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, 0, 0);
        animationCanvas.vertex(Animation.WALL_LEN, 0, 0);
        animationCanvas.vertex(Animation.WALL_LEN, 0, Animation.WALL_WID);
        animationCanvas.vertex(0, 0, Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        animationCanvas.beginShape();
        animationCanvas.vertex(0, this.farTower.getHeight(), 0);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), 0);
        animationCanvas.vertex(Animation.WALL_LEN, this.nearTower.getHeight(), Animation.WALL_WID);
        animationCanvas.vertex(0, this.farTower.getHeight(), Animation.WALL_WID);
        animationCanvas.endShape(animationCanvas.CLOSE);

        if (this.myWheel !== null) {
            animationCanvas.translate(Animation.WALL_LEN / 2, (this.t1.getHeight() + this.t2.getHeight())/2, Animation.WALL_WID/2);
            this.myWheel.display();
            this.myWheel.turn();
        }

        animationCanvas.pop();
    }

    updateBalls() {
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i];
            b.display();
            b.move();
            if (b.getX() > Animation.WALL_LEN + Animation.WALL_WID) {
                this.balls.splice(i, 1);
                this.readyForBall = true;
                this.t2.addWaitingBall();
            }
        }

        while (this.readyForBall && this.t1.takeWaitingBall()) {
            // Find x for ball that is closest to t1
            let x = Animation.WALL_LEN + Animation.WALL_WID;
            for (let b of this.balls) {
                if (b.getX() < x) {
                    x = b.getX();
                }
            }

            this.addNewBall(x - (Animation.WALL_LEN + Animation.WALL_WID) / this.maxBalls);
            // console.log("x: " + (x - (Animation.WALL_LEN + Animation.WALL_WID) / this.maxBalls));
            if (this.balls.length >= this.maxBalls) {
                this.readyForBall = false;
            }
        }
    }

    setMaxBalls(balls) {
        this.maxBalls = balls;
    }

    getMaxBalls() {
        return this.maxBalls;
    }

    addWheel() {
        let spinDirection = 1;
        if (this.farTower === this.t2) {
            spinDirection = -1;
        }
        this.myWheel = new Wheel(spinDirection * this.current);
    }

    addSkiLift(posEnd) {
        this.batteryPosEnd = posEnd;
    }

    addNewBall(x) {
        this.balls.push(new Ball(this, x));
    }

    getCurrent() {
        return this.current;
    }

    getT1() {
        return this.t1;
    }

    getT2() {
        return this.t2;
    }

    getPosEnd() {
        return this.batteryPosEnd;
    }
}
