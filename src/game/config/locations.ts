import { ObjectLocations } from '../utils/ObjectLocator';

export const MainMenuLocations: ObjectLocations = {
    logo: {
        x: 0,
        y: 0,
        scale: 1,
        relative: {
            fromCenter: true,
            offsetY: -100
        }
    },
    playButton: {
        x: 0,
        y: 0,
        scale: 0.8,
        relative: {
            fromCenter: true,
            offsetY: 50
        }
    },
    settingsButton: {
        x: 0,
        y: 0,
        scale: 0.8,
        relative: {
            fromCenter: true,
            offsetY: 150
        }
    }
};

export const GameLocations: ObjectLocations = {
    player: {
        x: 0,
        y: 0,
        scale: 1,
        relative: {
            fromCenter: true
        }
    },
    enemy: {
        x: 0,
        y: 0,
        relative: {
            fromCenter: true,
            offsetX: 200  // Position enemy 200 pixels to the right of center
        }
    }
};

export const GameOverLocations: ObjectLocations = {
    gameOverText: {
        x: 0,
        y: 0,
        relative: {
            fromCenter: true,
            offsetY: -100
        }
    },
    finalScore: {
        x: 0,
        y: 0,
        relative: {
            fromCenter: true
        }
    },
    restartButton: {
        x: 0,
        y: 0,
        scale: 0.8,
        relative: {
            fromCenter: true,
            offsetY: 100
        }
    }
};
