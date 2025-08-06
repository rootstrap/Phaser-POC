import { GameObjects, Scene } from 'phaser';
import { EventBus, EventName } from '../EventBus';
import { ObjectLocator } from '../utils/ObjectLocator';
import { MainMenuLocations } from '../config/locations';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    startGameText: GameObjects.Text;
    backgroundOverlay: GameObjects.Graphics;
    titleGlow: GameObjects.Graphics;
    floatingDots: GameObjects.Group;

    private readonly locator: ObjectLocator;

    constructor() {
        super('MainMenu');
        this.locator = ObjectLocator.getInstance();
        this.locator.registerLocations('MainMenu', MainMenuLocations);
    }

    create() {
        this.createEnhancedBackground();
        this.createFloatingDots();
        this.createEnhancedTitle();
        this.createSubtitle();
        this.createEnhancedButton();

        EventBus.emit(EventName.SCENE_READY, this);
    }

    private createEnhancedBackground() {
        // Create gradient background overlay
        this.backgroundOverlay = this.add.graphics();
        
        // Create a radial gradient effect
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Dark blue to lighter blue gradient
        this.backgroundOverlay.fillGradientStyle(0x001133, 0x001133, 0x003366, 0x003366, 1);
        this.backgroundOverlay.fillRect(0, 0, width, height);

        // Add the original background image with better blending
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');
        this.background.setAlpha(0.4);
        this.background.setTint(0x4488FF);
        this.background.setBlendMode(Phaser.BlendModes.OVERLAY);

        // Add subtle pulsing animation
        this.tweens.add({
            targets: this.background,
            alpha: { from: 0.3, to: 0.5 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createFloatingDots() {
        this.floatingDots = this.add.group();
        
        // Create pac-dots floating around
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
            
            const dot = this.add.circle(x, y, 4, 0xFFFF00, 0.8);
            this.floatingDots.add(dot);
            
            // Animate each dot
            this.tweens.add({
                targets: dot,
                y: y + Phaser.Math.Between(-30, 30),
                x: x + Phaser.Math.Between(-20, 20),
                alpha: { from: 0.5, to: 1 },
                scale: { from: 0.8, to: 1.2 },
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    private createEnhancedTitle() {
        const titlePos = this.locator.getPositionFromConfig(this, 
            this.locator.getLocation('MainMenu', 'logo') ?? this.locator.centerObject(this)
        );

        // Create glow effect behind title
        this.titleGlow = this.add.graphics();
        this.titleGlow.fillStyle(0xFFFF00, 0.3);
        this.titleGlow.fillCircle(titlePos.x, titlePos.y, 100);
        this.titleGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Animate the glow
        this.tweens.add({
            targets: this.titleGlow,
            scaleX: { from: 1, to: 1.3 },
            scaleY: { from: 1, to: 1.3 },
            alpha: { from: 0.2, to: 0.4 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Enhanced title with better styling
        this.title = this.add.text(titlePos.x, titlePos.y, 'POC-MAN', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: 48,
            color: '#FFFF00',
            stroke: '#FF6600',
            strokeThickness: 5,
            align: 'center',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 6,
                fill: true
            }
        }).setOrigin(0.5).setDepth(100);

        // Title entrance animation
        this.title.setScale(0);
        this.tweens.add({
            targets: this.title,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });

        // Subtle breathing animation
        this.tweens.add({
            targets: this.title,
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 800
        });
    }

    private createSubtitle() {
        const titlePos = this.locator.getPositionFromConfig(this, 
            this.locator.getLocation('MainMenu', 'logo') ?? this.locator.centerObject(this)
        );

        this.subtitle = this.add.text(titlePos.x, titlePos.y + 65, 'A Proof of Concept Adventure', {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            color: '#CCCCCC',
            align: 'center'
        }).setOrigin(0.5).setDepth(99);

        // Subtitle entrance animation
        this.subtitle.setAlpha(0);
        this.tweens.add({
            targets: this.subtitle,
            alpha: 0.9,
            duration: 1000,
            delay: 600,
            ease: 'Power2'
        });
    }

    private createEnhancedButton() {
        const buttonPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('MainMenu', 'playButton') ?? this.locator.centerObject(this)
        );

        // Create button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x000000, 0.7);
        buttonBg.fillRoundedRect(-70, -18, 140, 36, 18);
        buttonBg.lineStyle(2, 0xFFFF00);
        buttonBg.strokeRoundedRect(-70, -18, 140, 36, 18);
        buttonBg.setPosition(buttonPos.x, buttonPos.y);

        this.startGameText = this.add.text(buttonPos.x, buttonPos.y, 'START GAME', {
            fontFamily: 'Arial Bold, sans-serif',
            fontSize: 18,
            color: '#FFFFFF',
            align: 'center'
        })
        .setOrigin(0.5)
        .setScale(buttonPos.scale ?? 1)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            // Hover effect
            this.tweens.add({
                targets: [this.startGameText, buttonBg],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x000000, 0.9);
            buttonBg.fillRoundedRect(-70, -18, 140, 36, 18);
            buttonBg.lineStyle(3, 0xFFFF00);
            buttonBg.strokeRoundedRect(-70, -18, 140, 36, 18);
        })
        .on('pointerout', () => {
            // Reset hover effect
            this.tweens.add({
                targets: [this.startGameText, buttonBg],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            
            buttonBg.clear();
            buttonBg.fillStyle(0x000000, 0.7);
            buttonBg.fillRoundedRect(-70, -18, 140, 36, 18);
            buttonBg.lineStyle(2, 0xFFFF00);
            buttonBg.strokeRoundedRect(-70, -18, 140, 36, 18);
        })
        .on('pointerdown', () => {
            // Click effect
            this.tweens.add({
                targets: [this.startGameText, buttonBg],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2',
                onComplete: () => this.changeScene()
            });
        });

        // Button entrance animation
        this.startGameText.setAlpha(0);
        buttonBg.setAlpha(0);
        this.tweens.add({
            targets: [this.startGameText, buttonBg],
            alpha: 1,
            duration: 600,
            delay: 1000,
            ease: 'Power2'
        });
    }
    
    changeScene() {
        this.scene.start('Game');
    }
}
