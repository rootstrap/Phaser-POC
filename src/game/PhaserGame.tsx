import { useEffect } from 'react';
import StartGame from './main';

export const PhaserGame = () => {
    useEffect(() => {
        const game = StartGame("game-container");

        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, []);

    return <div id="game-container" />;
};
