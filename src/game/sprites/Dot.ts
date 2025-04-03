import { Scene } from 'phaser';

export class Dot extends Phaser.GameObjects.Arc {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 4, 0, 360, false, 0xffffff);  // White circle

        // Add this dot to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this as Phaser.GameObjects.GameObject, true);  // true makes it static
    }

    collect() {
        this.destroy();
    }
}
