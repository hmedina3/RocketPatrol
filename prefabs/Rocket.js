// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      // track rocket's firing status
      this.isFiring = false;
      // add rocket sfx
      this.sfxRocket = scene.sound.add('sfx_rocket'); 
      
    }
   
    update(){
     
      // left/right movement
      if(!this.isFiring){
        if(keyLEFT.isDown && this.x >= 47){
          this.x -= 2;
        }
        else if(keyRIGHT.isDown && this.x <= 578){
          this.x += 2;
        }
        else{
          ;
        }
      }
      // control rocket
      if(this.isFiring){
        if(keyLEFT.isDown && this.x >= 47){
          this.x -= 2;
        }
        else if(keyRIGHT.isDown && this.x <= 578){
          this.x += 2;
        }
        else{
          ;
        }
      }

      // fire button
      if(Phaser.Input.Keyboard.JustDown(keyF)){
        this.isFiring = true;
        // play sfx
        this.sfxRocket.play();
      }

      // if fired, move up
      if(this.isFiring && this.y >= 108){
        // move rocket forward
       this.y -= 2;

      } // end of if firing rocket.
      
      // reset on miss
      if(this.y <= 108){
        this.isFiring = false;
        this.y = 431;
      }
    }
    // reset rocket to "ground"
    reset(){
      this.isFiring = false;
      this.y = 431;
    }
  }