import { Scene } from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.GameObjects.Rectangle {
    private readonly speed: number = 100;
    private player: Player;
    public body: Phaser.Physics.Arcade.Body;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 32, 32, 0xff0000);  // Red color
        this.player = player;

        // Add this rectangle to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this as Phaser.GameObjects.GameObject, false);  // false makes it dynamic

        // Cast the body to the correct type
        this.body = this.body as Phaser.Physics.Arcade.Body;

        // Set up physics properties
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1, 1);
    }

    update() {
        if (!this.player) return;

        // Calculate direction to player
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        // Set velocity based on angle
        this.scene.physics.velocityFromRotation(
            angle,
            this.speed,
            this.body.velocity
        );
    }
}
