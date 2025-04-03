import { Scene } from 'phaser';

export class Player extends Phaser.GameObjects.Rectangle {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number = 200;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 32, 32, 0x0000ff);

        // Add this rectangle to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);

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
        } else if (this.cursors.right.isDown) {
            body.setVelocityX(this.moveSpeed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            body.setVelocityY(-this.moveSpeed);
        } else if (this.cursors.down.isDown) {
            body.setVelocityY(this.moveSpeed);
        }

        // Normalize diagonal movement
        if (body.velocity.x !== 0 && body.velocity.y !== 0) {
            body.velocity.normalize().scale(this.moveSpeed);
        }
    }
}
