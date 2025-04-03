import { GameObjects, Scene } from 'phaser';
import { EventBus, EventName } from '../EventBus';
import { ObjectLocator } from '../utils/ObjectLocator';
import { MainMenuLocations } from '../config/locations';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    startGameText: GameObjects.Text;

    private readonly locator: ObjectLocator;

    constructor() {
        super('MainMenu');
        this.locator = ObjectLocator.getInstance();
        this.locator.registerLocations('MainMenu', MainMenuLocations);
    }

    create() {
        // Center the background using ObjectLocator
        const bgPos = this.locator.centerObject(this);
        this.background = this.add.image(bgPos.x, bgPos.y, 'background');

        // Get title position from locations config with relative positioning
        const titlePos = this.locator.getPositionFromConfig(this, 
            this.locator.getLocation('MainMenu', 'logo') ?? this.locator.centerObject(this)
        );
        this.title = this.add.text(titlePos.x, titlePos.y, 'Phaser POC', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Get button position from locations config with relative positioning
        const buttonPos = this.locator.getPositionFromConfig(this,
            this.locator.getLocation('MainMenu', 'playButton') ?? this.locator.centerObject(this)
        );
        this.startGameText = this.add.text(buttonPos.x, buttonPos.y, 'Start Game', {
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
    
    changeScene() {
        this.scene.start('Game');
    }
}
