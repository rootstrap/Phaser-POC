import { EventBus, EventName } from '../EventBus';
import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';
import { GameLocations } from '../config/locations';
import { Player } from '../sprites/Player';
import { Enemy } from '../sprites/Enemy';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    enemy: Enemy;

    private readonly locator: ObjectLocator;

    constructor() {
        super('Game');
        this.locator = ObjectLocator.getInstance();
        this.locator.registerLocations('Game', GameLocations);
    }

    create() {
        // Enable physics
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        // Use ObjectLocator to position background
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');
        this.background.setAlpha(0.5);

        // Create player at the center of the screen
        const playerPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('Game', 'player') ?? this.locator.centerObject(this)
        );
        this.player = new Player(this, playerPos.x, playerPos.y);

        // Create enemy at a fixed position
        const enemyPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('Game', 'enemy') ?? this.locator.centerObject(this, 200, 0)
        );
        this.enemy = new Enemy(this, enemyPos.x, enemyPos.y, this.player);

        // Add collision between player and enemy
        this.physics.add.collider(
            this.player as unknown as Phaser.GameObjects.GameObject,
            this.enemy as unknown as Phaser.GameObjects.GameObject,
            this.handleCollision,
            undefined,
            this
        );

        EventBus.emit(EventName.SCENE_READY, this);
    }

    update() {
        // Update player movement
        this.player?.update();
        // Update enemy movement
        this.enemy?.update();
    }

    private handleCollision() {
        // End the game when player collides with enemy
        this.scene.start('GameOver');
    }
}
