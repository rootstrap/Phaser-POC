import { EventBus, EventName } from '../EventBus';
import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';
import { GameLocations } from '../config/locations';
import { Player } from '../sprites/Player';
import { Enemy } from '../sprites/Enemy';
import { Wall } from '../sprites/Wall';
import { Dot } from '../sprites/Dot';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    enemy: Enemy;
    walls: Wall[] = [];
    dots: Dot[] = [];
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;

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
        this.camera.setBackgroundColor(0x000033);

        // Use ObjectLocator to position background
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');
        this.background.setAlpha(0.2);

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

        // Create dots
        this.createDots();

        // Create score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff'
        });
        this.scoreText.setScrollFactor(0);

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

        // Add overlap between player and dots
        this.dots.forEach(dot => {
            this.physics.add.overlap(
                this.player as unknown as Phaser.GameObjects.GameObject,
                dot as unknown as Phaser.GameObjects.GameObject,
                this.collectDot,
                undefined,
                this
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

    private createDots() {
        const { width, height } = this.scale;
        const spacing = 80; // Space between dots
        const margin = 60; // Margin from walls

        // Create a grid of dots
        for (let x = margin; x < width - margin; x += spacing) {
            for (let y = margin; y < height - margin; y += spacing) {
                // Check if the dot would intersect with any walls
                const dot = new Dot(this, x, y);
                if (!this.walls.some(wall => this.physics.overlap(dot, wall))) {
                    this.dots.push(dot);
                } else {
                    dot.destroy();
                }
            }
        }
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

    private collectDot(_player: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile, dot: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile) {
        const collectibleDot = dot as Dot;
        collectibleDot.collect();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        // Remove the dot from our array
        this.dots = this.dots.filter(d => d !== collectibleDot);

        // Check if all dots are collected - Victory!
        if (this.dots.length === 0) {
            // Save the score to pass it to the Win scene
            this.registry.set('score', this.score);
            this.scene.start('Win');
        }
    }

    private handleCollision() {
        // End the game when player collides with enemy
        this.scene.start('GameOver');
    }
}
