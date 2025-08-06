import { Scene } from 'phaser';

export class Player extends Phaser.GameObjects.Rectangle {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number = 200;
    private pacmanSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 32, 32, 0x0000ff);
        this.setAlpha(0); // Make the rectangle invisible

        // Add this rectangle to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Add animated Pac-Man sprite at the same position
        this.pacmanSprite = scene.add.sprite(x, y, 'pacman-frame1');
        
        // Start the chomping animation
        this.pacmanSprite.play('pacman-chomp');
        
        // Scale the sprite to match the rectangle size
        const originalSize = 32; // Size of the rectangle
        const imageSize = Math.max(this.pacmanSprite.width, this.pacmanSprite.height);
        const scale = originalSize / imageSize;
        this.pacmanSprite.setScale(scale);

        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        
        // Disable physics debug display
        body.debugShowBody = false;
        body.debugShowVelocity = false;

        // Get cursor keys
        if (!scene.input.keyboard) {
            throw new Error('Keyboard input not available');
        }
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (!body) return;

        // Reset velocity
        body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            body.setVelocityX(-this.moveSpeed);
            this.pacmanSprite.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            body.setVelocityX(this.moveSpeed);
            this.pacmanSprite.setFlipX(false);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            body.setVelocityY(-this.moveSpeed);
            this.pacmanSprite.setAngle(-90);
        } else if (this.cursors.down.isDown) {
            body.setVelocityY(this.moveSpeed);
            this.pacmanSprite.setAngle(90);
        }

        // Reset angle when moving horizontally
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.pacmanSprite.setAngle(0);
        }

        // Normalize diagonal movement
        if (body.velocity.x !== 0 && body.velocity.y !== 0) {
            body.velocity.normalize().scale(this.moveSpeed);
        }
        
        // Update Pac-Man sprite position to match the rectangle
        this.pacmanSprite.setPosition(this.x, this.y);
        
        // Make sure the animation is playing when moving
        if ((body.velocity.x !== 0 || body.velocity.y !== 0) && !this.pacmanSprite.anims.isPlaying) {
            this.pacmanSprite.play('pacman-chomp');
        }
    }
}
