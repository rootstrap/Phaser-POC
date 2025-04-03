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
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
