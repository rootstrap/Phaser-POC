import { Scene } from 'phaser';
import { ObjectLocator } from '../utils/ObjectLocator';

export class Win extends Scene {
    constructor() {
        super('Win');
    }

    create() {
        const locator = ObjectLocator.getInstance();
        const centerPos = locator.centerObject(this);

        // Add congratulations text
        const congratsText = this.add.text(centerPos.x, centerPos.y - 50, 'Congratulations!', {
            fontSize: '64px',
            color: '#fff'
        });
        congratsText.setOrigin(0.5);

        // Add score text
        const score = this.registry.get('score') || 0;
        const scoreText = this.add.text(centerPos.x, centerPos.y + 50, `Final Score: ${score}`, {
            fontSize: '32px',
            color: '#fff'
        });
        scoreText.setOrigin(0.5);

        // Add restart button
        const restartButton = this.add.text(centerPos.x, centerPos.y + 150, 'Play Again', {
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#000'
        });
        restartButton.setOrigin(0.5);
        restartButton.setPadding(20);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
