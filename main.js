const player = document.getElementById("player");
const layer1 = document.getElementById("layer1");
const layer2 = document.getElementById("layer2");
const layer3 = document.getElementById("layer3");
const layer4 = document.getElementById("layer4");
const layer5 = document.getElementById("layer5");
const enemy_fly = document.getElementById("enemy_fly");
const enemy_plant = document.getElementById("enemy_plant");
const enemy_spider_big = document.getElementById("enemy_spider_big");
const enemy_spider = document.getElementById("enemy_spider");
const fire = document.getElementById("fire");
const collisionAnimation = document.getElementById("collisionAnimation");
const lives = document.getElementById("lives");

player.src = "./images/shadow_dog.png";
layer1.src = "./images/backgroundLayers/layer-1.png";
layer2.src = "./images/backgroundLayers/layer-2.png";
layer3.src = "./images/backgroundLayers/layer-3.png";
layer4.src = "./images/backgroundLayers/layer-4.png";
layer5.src = "./images/backgroundLayers/layer-5.png";
enemy_fly.src = "./images/enemies/enemy_fly.png";
enemy_plant.src = "./images/enemies/enemy_plant.png";
enemy_spider_big.src = "./images/enemies/enemy_spider_big.png";
enemy_spider.src = "./images/enemies/enemy_spider.png";
fire.src = "./images/design/fire.png";
collisionAnimation.src = "./images/design/boom.png";
lives.src = "./images/design/lives.png";
import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemyBig, GroundEnemy, ClimbingEnemySmall } from "./enemies.js";
import { UI } from "./UI.js";



window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);    
            this.UI = new UI(this);
            this.enemies = []; 
            this.particles = [];
            this.collisions = [];
            this.maxParticles = 50; 
            this.enemyTimer = 0;    
            this.enemyInterval = 1500;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            /*this.time = 0;
            this.maxTime = 100000;*/
            this.gameOver = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            /*this.time+= deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;*/
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collisions, index) => {
                collisions.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);

        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemyBig(this));
            this.enemies.push(new FlyingEnemy(this));
            this.enemies.push(new ClimbingEnemySmall(this));

        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});
