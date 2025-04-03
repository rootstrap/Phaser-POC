import { Scene } from 'phaser';

export class Wall extends Phaser.GameObjects.Rectangle {
    constructor(scene: Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0x0000ff);  // Blue color

        // Add this rectangle to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this as Phaser.GameObjects.GameObject, true);  // true makes it static
    }
}
