/*

Mods added:
1. Track a high score that persists across scenes and display it in the UI (10) 
2. Implement the 'FIRE' UI text from the original game (10)
3. Add your own (copyright-free) background music to the Play scene (10)
4. Implement the speed increase that happens after 30 seconds in the original game (10)
5. Randomize each spaceship's movement direction at the start of each play (10)
6. Create a new scrolling tile sprite for the background (10)
7. Allow the player to control the Rocket after it's fired (10) (controls are with left and right arrow.)
8. Display the time remaining (in seconds) on the screen (15)
9. Replace the UI borders with new artwork (15)

*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
  }

  // reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config); 
// define game settings
game.settings = {
  spaceshipSpeed: 3,
  gameTimer: 60000    
}

