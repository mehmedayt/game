import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";

export class Player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame ;
        this.fps = 20;
        this.frameInterval = 1000 /this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states  = [new Sitting(this.game), new Running(this.game),
        new Jumping(this.game), new Falling(this.game),
        new Rolling(this.game), new Diving(this.game),
        new Hit(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // horizontal boundaries
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // vertical boundaries
        if(this.y > this.game.height - this.height - this.game.groundMargin)
        this.y = this.game.height - this.height - this.game.groundMargin;
        // sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }else{
            this.frameTimer += deltaTime;
        }
         
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x+25, this.y+30, this.width-40,this.height-40);
        //if (this.game.debug) context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        context.drawImage(this.image, this.frameX * this.width,
            this.frameY * this.height,
            this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x+25 + this.width-40 &&
                enemy.x + enemy.width > this.x+25 &&
                enemy.y < this.y+30 + this.height-40 &&
                enemy.y + enemy.height > this.y+30
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game,
                enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] ||
                this.currentState === this.states[5]){
                    this.game.score++;

                }else{
                    this.setState(6, 0);
                    this.game.lives--;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }
            }       
        })
    }
}
$("#canvas1").swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
    const player = game.player;

    if (direction === "up") {
      console.log("Swipe up detected");
      // Handle swipe up
    } else if (direction === "down") {
      console.log("Swipe down detected");
      // Handle swipe down
    } else if (direction === "left") {
      console.log("Swipe left detected");
      // Handle swipe left
    } else if (direction === "right") {
      console.log("Swipe right detected");
      // Handle swipe right
    }
  }
});

