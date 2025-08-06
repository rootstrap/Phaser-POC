import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload() {
        // The Boot Scene can be used to load assets needed for the Preloader.
        // Currently, we don't need any assets for the Preloader.
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
