import { EventBus, EventName } from '../EventBus';
import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';
import { GameOverLocations } from '../config/locations';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    backToMenuText: Phaser.GameObjects.Text;

    private readonly locator: ObjectLocator;

    constructor() {
        super('GameOver');
        this.locator = ObjectLocator.getInstance();
        this.locator.registerLocations('GameOver', GameOverLocations);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        // Center the background
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');
        this.background.setAlpha(0.5);

        // Position game over text using relative positioning
        const gameOverPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('GameOver', 'gameOverText') ?? this.locator.centerObject(this)
        );
        this.gameOverText = this.add.text(gameOverPos.x, gameOverPos.y, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Position back to menu button using relative positioning
        const buttonPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('GameOver', 'restartButton') ?? {
                x: 0, y: 0,
                relative: { fromCenter: true, offsetY: 100 }
            }
        );
        this.backToMenuText = this.add.text(buttonPos.x, buttonPos.y, 'Back to Main Menu', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            align: 'center'
        })
        .setOrigin(0.5)
        .setScale(buttonPos.scale ?? 1)
        .setInteractive()
        .on('pointerdown', () => this.changeScene());

        EventBus.emit(EventName.SCENE_READY, this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
