import { EventBus, EventName } from '../EventBus';
import { GameObjects, Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';
import { GameOverLocations } from '../config/locations';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    backToMenuText: Phaser.GameObjects.Text;
    backgroundOverlay: GameObjects.Graphics;
    titleGlow: GameObjects.Graphics;
    floatingDots: GameObjects.Group;

    private readonly locator: ObjectLocator;

    constructor() {
        super('GameOver');
        this.locator = ObjectLocator.getInstance();
        this.locator.registerLocations('GameOver', GameOverLocations);
    }

    create() {
        this.camera = this.cameras.main;
        
        this.createEnhancedBackground();
        this.createFloatingDots();
        this.createEnhancedGameOverText();
        this.createScoreDisplay();
        this.createEnhancedButton();

        EventBus.emit(EventName.SCENE_READY, this);
    }

    private createEnhancedBackground() {
        // Create gradient background overlay with darker, more dramatic colors for game over
        this.backgroundOverlay = this.add.graphics();
        
        // Create a radial gradient effect with darker red/purple tones
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Dark red to dark purple gradient for dramatic effect
        this.backgroundOverlay.fillGradientStyle(0x330011, 0x330011, 0x110033, 0x110033, 1);
        this.backgroundOverlay.fillRect(0, 0, width, height);

        // Add the original background image with better blending
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');
        this.background.setAlpha(0.3);
        this.background.setTint(0xFF4444);
        this.background.setBlendMode(Phaser.BlendModes.OVERLAY);

        // Add subtle pulsing animation
        this.tweens.add({
            targets: this.background,
            alpha: { from: 0.2, to: 0.4 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createFloatingDots() {
        this.floatingDots = this.add.group();
        
        // Create darker, more somber floating elements
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
            
            const dot = this.add.circle(x, y, 3, 0xFF6666, 0.6);
            this.floatingDots.add(dot);
            
            // Animate each dot with slower, more melancholic movement
            this.tweens.add({
                targets: dot,
                y: y + Phaser.Math.Between(-20, 20),
                x: x + Phaser.Math.Between(-15, 15),
                alpha: { from: 0.3, to: 0.7 },
                scale: { from: 0.6, to: 1.0 },
                duration: Phaser.Math.Between(3000, 5000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    private createEnhancedGameOverText() {
        const gameOverPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('GameOver', 'gameOverText') ?? this.locator.centerObject(this)
        );

        // Create glow effect behind title with red/orange colors
        this.titleGlow = this.add.graphics();
        this.titleGlow.fillStyle(0xFF6600, 0.4);
        this.titleGlow.fillCircle(gameOverPos.x, gameOverPos.y, 120);
        this.titleGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Animate the glow with a more dramatic pulse
        this.tweens.add({
            targets: this.titleGlow,
            scaleX: { from: 1, to: 1.4 },
            scaleY: { from: 1, to: 1.4 },
            alpha: { from: 0.2, to: 0.5 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Enhanced game over text with dramatic styling
        this.gameOverText = this.add.text(gameOverPos.x, gameOverPos.y, 'GAME OVER', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: 56,
            color: '#FF6666',
            stroke: '#CC0000',
            strokeThickness: 6,
            align: 'center',
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 8,
                fill: true
            }
        }).setOrigin(0.5).setDepth(100);

        // Title entrance animation with dramatic effect
        this.gameOverText.setScale(0);
        this.gameOverText.setAlpha(0);
        this.tweens.add({
            targets: this.gameOverText,
            scale: 1,
            alpha: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        // Subtle breathing animation
        this.tweens.add({
            targets: this.gameOverText,
            scaleX: { from: 1, to: 1.03 },
            scaleY: { from: 1, to: 1.03 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1000
        });
    }

    private createScoreDisplay() {
        const gameOverPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('GameOver', 'gameOverText') ?? this.locator.centerObject(this)
        );

        // Get the score from the registry
        const score = this.registry.get('score') || 0;

        // Create the score text positioned below the game over text
        this.scoreText = this.add.text(gameOverPos.x, gameOverPos.y + 80, `FINAL SCORE: ${score}`, {
            fontFamily: 'Arial Bold, sans-serif',
            fontSize: 32,
            color: '#FFAA44',
            stroke: '#CC6600',
            strokeThickness: 3,
            align: 'center',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5).setDepth(99);

        // Score entrance animation
        this.scoreText.setScale(0);
        this.scoreText.setAlpha(0);
        this.tweens.add({
            targets: this.scoreText,
            scale: 1,
            alpha: 1,
            duration: 800,
            delay: 800,
            ease: 'Back.easeOut'
        });

        // Subtle glow animation for the score
        this.tweens.add({
            targets: this.scoreText,
            scaleX: { from: 1, to: 1.02 },
            scaleY: { from: 1, to: 1.02 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1600
        });
    }

    private createEnhancedButton() {
        const buttonPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('GameOver', 'restartButton') ?? {
                x: 0, y: 0,
                relative: { fromCenter: true, offsetY: 160 }
            }
        );

        // Create button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x000000, 0.8);
        buttonBg.fillRoundedRect(-85, -18, 170, 36, 18);
        buttonBg.lineStyle(2, 0xFF6666);
        buttonBg.strokeRoundedRect(-85, -18, 170, 36, 18);
        buttonBg.setPosition(buttonPos.x, buttonPos.y);

        this.backToMenuText = this.add.text(buttonPos.x, buttonPos.y, 'BACK TO MENU', {
            fontFamily: 'Arial Bold, sans-serif',
            fontSize: 16,
            color: '#FFFFFF',
            align: 'center'
        })
        .setOrigin(0.5)
        .setScale(buttonPos.scale ?? 1)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            // Hover effect
            this.tweens.add({
                targets: [this.backToMenuText, buttonBg],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x000000, 0.9);
            buttonBg.fillRoundedRect(-85, -18, 170, 36, 18);
            buttonBg.lineStyle(3, 0xFF6666);
            buttonBg.strokeRoundedRect(-85, -18, 170, 36, 18);
        })
        .on('pointerout', () => {
            // Reset hover effect
            this.tweens.add({
                targets: [this.backToMenuText, buttonBg],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x000000, 0.8);
            buttonBg.fillRoundedRect(-85, -18, 170, 36, 18);
            buttonBg.lineStyle(2, 0xFF6666);
            buttonBg.strokeRoundedRect(-85, -18, 170, 36, 18);
        })
        .on('pointerdown', () => {
            // Click effect
            this.tweens.add({
                targets: [this.backToMenuText, buttonBg],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2',
                onComplete: () => this.changeScene()
            });
        });

        // Button entrance animation
        this.backToMenuText.setAlpha(0);
        buttonBg.setAlpha(0);
        this.tweens.add({
            targets: [this.backToMenuText, buttonBg],
            alpha: 1,
            duration: 800,
            delay: 1200,
            ease: 'Power2'
        });
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
