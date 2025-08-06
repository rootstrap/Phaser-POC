import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';

export class Preloader extends Scene
{
    private readonly locator: ObjectLocator;

    constructor() {
        super('Preloader');
        this.locator = ObjectLocator.getInstance();
    }

    init() {
        // Center the background
        const bgPos = this.locator.centerObject(this);
        this.add.image(bgPos.x, bgPos.y, 'background');

        // Center the progress bar
        const barPos = this.locator.centerObject(this);
        const barWidth = 468;
        const barHeight = 32;

        // Progress bar outline
        this.add.rectangle(barPos.x, barPos.y, barWidth, barHeight)
            .setStrokeStyle(1, 0xffffff);

        // Progress bar fill
        const bar = this.add.rectangle(
            barPos.x - (barWidth / 2) + 2,  // Align to left of outline with 2px padding
            barPos.y,
            4,  // Initial width
            barHeight - 4,  // Height with 2px padding on top and bottom
            0xffffff
        );

        // Update progress bar width based on loading progress
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + ((barWidth - 8) * progress);  // Account for 4px padding on each side
        });
    }

    preload() {
        //  Load the assets for the game
        this.load.setPath('assets');

        this.load.image('background', 'bg.png');
        
        // Reset path to load from src folder
        this.load.setPath('');
        
        // Load Pac-Man frames
        this.load.image('pacman-frame1', 'src/game/sprites/Player/frame1.png');
        this.load.image('pacman-frame2', 'src/game/sprites/Player/frame2.png');
        
        // Load ghost sprite
        this.load.image('ghost', 'src/game/sprites/Enemies/ghost.png');
        
        // Reset path back to assets for other assets
        this.load.setPath('assets');
    }

    create() {
        // Create Pac-Man chomping animation
        this.anims.create({
            key: 'pacman-chomp',
            frames: [
                { key: 'pacman-frame1' },
                { key: 'pacman-frame2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // Move to the MainMenu
        this.scene.start('MainMenu');
    }
}
