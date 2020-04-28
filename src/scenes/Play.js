class Play extends Phaser.Scene {
     
 
    constructor() {
        super("playScene");
    }
    preload() {
        // load background music
        this.load.audio('sfx_music', './assets/bensound-moose.mp3'); // Music: https://www.bensound.com
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        // load borders
        this.load.image('newUI', './assets/newUI.png');
        this.load.image('Borders', './assets/Borders.png');
        // new starfield
        this.load.image('starfield', './assets/starfield2.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }

    create() {
        // play music
        let music = this.sound.add('sfx_music');
        music.play();
    
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.newUI = this.add.tileSprite(37, 42, 566, 64, 'newUI').setOrigin(0, 0);   
         // add spaceships (x3) with random direction old values: +192, 132; +96, 196; 260
         var value1 = Phaser.Math.Between(100, 260);
         var value2 = Phaser.Math.Between(100, 260);
         var value3 = Phaser.Math.Between(200, 260);
 
         this.ship01 = new Spaceship(this, game.config.width + 192, value1, 'spaceship', 0, 30).setOrigin(0,0);
         this.ship02 = new Spaceship(this, game.config.width + 96, value2, 'spaceship', 0, 20).setOrigin(0,0);
         this.ship03 = new Spaceship(this, game.config.width, value3, 'spaceship', 0, 10).setOrigin(0,0);

       // custom rectangle borders
        this.add.rectangle(5, 5, 630, 32, 'Borders').setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 'Borders').setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 'Borders').setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 'Borders').setOrigin(0, 0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        
       
      // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
        key: 'explode', 
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });
        // saves current spaceship speed
        this.thecheck = game.settings.spaceshipSpeed;
        // score
        this.p1Score = 0;
        // score display
         let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 55
        }
        // Fire UI
        let fireUIConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 70
        } 
        // x,y, text, configs
      this.Middle = this.add.text(400, 54, 'FIRE', fireUIConfig);

      // Time UI
      let timeUIConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'left',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 75
    } 
    this.timer = this.formatTime(game.settings.gameTimer);
    this.Right = this.add.text(500, 54, this.timer, timeUIConfig);

    var timeInSeconds;
    timeInSeconds = this.time.addEvent({delay:1000, callback: this.onEvent, callbackScope: this, loop:true});
    
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        // highscore display
        let highScoreConfig = {
            fontFamily: 'Monospace',
            fontSize: '32px',
            color: "#00ff00",
            align: "center"
        }

        // game over flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        music.stop();
        this.add.text(game.config.width/2, game.config.height/2, "GAME OVER\nScore: "+this.p1Score,scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 100, "Current Highscore: "+localStorage.getItem("highscore"),highScoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
         }, null, this);
    } // end of create

      update() {
          
        // Tracking highscore
          var highScore = localStorage.getItem("highscore");
          if(highScore == null){
            localStorage.setItem("highscore", 0);
            highScore = 0;
          }
          else if(this.p1Score > highScore){
              localStorage.setItem("highscore", this.p1Score);
          }

           // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
        this.scene.restart(this.p1Score);
        game.settings.spaceshipSpeed = this.thecheck;
        
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        if(!this.gameOver){
        this.starfield.tilePositionX -= 4;
        this.p1Rocket.update();
        // update spaceships (x3)
        this.ship01.update();               
        this.ship02.update();
        this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        
      
      }
      formatTime(milliseconds){
               return milliseconds / 1000;
      }
      onEvent(){
          if(this.timer > 0){
            this.timer -= 1;
          }
          this.Right.setText(this.timer);
      }
      
      checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            this.Middle.visible = !this.Middle.visible; // Fire Blinks
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite

            
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        // explosion sound
        this.sound.play('sfx_explosion');
        // Fire Blinks
        this.Middle.visible = !this.Middle.visible;
        // increase speed of spaceships when a collision happens
       game.settings.spaceshipSpeed++;
    
    }

} // end of Play.js