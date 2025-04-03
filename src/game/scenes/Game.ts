import { EventBus, EventName } from '../EventBus';
import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';
import { GameLocations } from '../config/locations';
import { Player } from '../sprites/Player';
import { Enemy } from '../sprites/Enemy';
import { Wall } from '../sprites/Wall';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    enemy: Enemy;
    walls: Wall[] = [];

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

        // Create walls
        this.createWalls();

        // Add collision between player and enemy
        this.physics.add.collider(
            this.player as unknown as Phaser.GameObjects.GameObject,
            this.enemy as unknown as Phaser.GameObjects.GameObject,
            this.handleCollision,
            undefined,
            this
        );

        // Add collisions with walls
        this.walls.forEach(wall => {
            this.physics.add.collider(
                this.player as unknown as Phaser.GameObjects.GameObject,
                wall as unknown as Phaser.GameObjects.GameObject
            );
            this.physics.add.collider(
                this.enemy as unknown as Phaser.GameObjects.GameObject,
                wall as unknown as Phaser.GameObjects.GameObject
            );
        });

        EventBus.emit(EventName.SCENE_READY, this);
    }

    update() {
        // Update player movement
        this.player?.update();
        // Update enemy movement
        this.enemy?.update();
    }

    private createWalls() {
        const wallThickness = 20;
        const { width, height } = this.scale;

        // Create outer walls
        this.walls.push(
            // Top wall
            new Wall(this, width / 2, wallThickness / 2, width, wallThickness),
            // Bottom wall
            new Wall(this, width / 2, height - wallThickness / 2, width, wallThickness),
            // Left wall
            new Wall(this, wallThickness / 2, height / 2, wallThickness, height),
            // Right wall
            new Wall(this, width - wallThickness / 2, height / 2, wallThickness, height)
        );

        // Add some internal walls to create a maze-like structure
        this.walls.push(
            // Horizontal walls
            new Wall(this, width / 4, height / 3, width / 3, wallThickness),
            new Wall(this, (width * 3) / 4, (height * 2) / 3, width / 3, wallThickness),
            // Vertical walls
            new Wall(this, width / 3, height / 2, wallThickness, height / 3),
            new Wall(this, (width * 2) / 3, height / 2, wallThickness, height / 3)
        );
    }

    private handleCollision() {
        // End the game when player collides with enemy
        this.scene.start('GameOver');
    }
}
