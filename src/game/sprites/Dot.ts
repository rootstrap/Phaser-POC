import { Scene } from 'phaser';

export class Dot extends Phaser.GameObjects.Arc {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 4, 0, 360, false, 0xFFB8AE);  // Light pink/orange color like classic Pac-Man dots

        // Add this dot to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this as Phaser.GameObjects.GameObject, true);  // true makes it static
    }

    collect() {
        // Add a small flash effect when collected
        const flash = this.scene.add.circle(this.x, this.y, 8, 0xFFFFFF);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 200,
            onComplete: () => flash.destroy()
        });
        
        this.destroy();
    }
}
