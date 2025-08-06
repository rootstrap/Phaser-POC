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
    
    // Pause elements
    private isPaused: boolean = false;
    private pauseOverlay: Phaser.GameObjects.Rectangle;
    private pauseText: Phaser.GameObjects.Text;
    private menuButton: Phaser.GameObjects.Text;
    private resumeButton: Phaser.GameObjects.Text;
    private escKey: Phaser.Input.Keyboard.Key;

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

        // Create score text - positioned lower to avoid cropping
        this.scoreText = this.add.text(20, 80, 'SCORE: 0', {
            fontSize: '24px',
            color: '#FFFFFF', 
            fontFamily: 'Arial, sans-serif',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setDepth(100);
        this.scoreText.setScrollFactor(0); // Keep score fixed on screen

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
        
        // Setup pause functionality
        this.setupPauseSystem();

        EventBus.emit(EventName.SCENE_READY, this);
    }
    
    setupPauseSystem() {
        // Register ESC key
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Create pause overlay (invisible by default)
        this.pauseOverlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.7
        );
        this.pauseOverlay.setVisible(false);
        this.pauseOverlay.setDepth(200);
        
        // Create pause text
        this.pauseText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 3,
            'PAUSED',
            {
                fontSize: '48px',
                color: '#FFFFFF',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        this.pauseText.setOrigin(0.5);
        this.pauseText.setVisible(false);
        this.pauseText.setDepth(201);
        
        // Create menu button
        this.menuButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'MAIN MENU',
            {
                fontSize: '32px',
                color: '#FFFF00',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.menuButton.setOrigin(0.5);
        this.menuButton.setVisible(false);
        this.menuButton.setDepth(201);
        this.menuButton.setInteractive({ useHandCursor: true });
        this.menuButton.on('pointerover', () => this.menuButton.setScale(1.1));
        this.menuButton.on('pointerout', () => this.menuButton.setScale(1));
        this.menuButton.on('pointerdown', () => this.scene.start('MainMenu'));
        
        // Create resume button
        this.resumeButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 60,
            'RESUME',
            {
                fontSize: '32px',
                color: '#FFFFFF',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.resumeButton.setOrigin(0.5);
        this.resumeButton.setVisible(false);
        this.resumeButton.setDepth(201);
        this.resumeButton.setInteractive({ useHandCursor: true });
        this.resumeButton.on('pointerover', () => this.resumeButton.setScale(1.1));
        this.resumeButton.on('pointerout', () => this.resumeButton.setScale(1));
        this.resumeButton.on('pointerdown', () => this.togglePause());
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        // Update pause UI visibility
        this.pauseOverlay.setVisible(this.isPaused);
        this.pauseText.setVisible(this.isPaused);
        this.menuButton.setVisible(this.isPaused);
        this.resumeButton.setVisible(this.isPaused);
        
        // Pause/resume game physics
        if (this.isPaused) {
            this.physics.pause();
        } else {
            this.physics.resume();
        }
    }

    update() {
        // Check for ESC key to pause/unpause
        if (Phaser.Input.Keyboard.JustDown(this.escKey as Phaser.Input.Keyboard.Key)) {
            this.togglePause();
        }
        
        // Only update game objects if not paused
        if (!this.isPaused) {
            // Update player movement
            this.player?.update();
            // Update enemy movement
            this.enemy?.update();
        }
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
        this.scoreText.setText(`SCORE: ${this.score}`);

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
        // Save the score to pass it to the GameOver scene
        this.registry.set('score', this.score);
        // End the game when player collides with enemy
        this.scene.start('GameOver');
    }
}
