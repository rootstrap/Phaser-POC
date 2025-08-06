import Phaser from 'phaser';

export interface ObjectPosition {
    x: number;
    y: number;
    scale?: number;
    relative?: {
        fromCenter?: boolean;
        offsetX?: number;
        offsetY?: number;
    };
}

export interface ObjectLocations {
    [key: string]: ObjectPosition;
}

export class ObjectLocator {
    private static instance: ObjectLocator;
    private locations: Map<string, ObjectLocations>;

    private constructor() {
        this.locations = new Map();
    }

    public static getInstance(): ObjectLocator {
        if (!ObjectLocator.instance) {
            ObjectLocator.instance = new ObjectLocator();
        }
        return ObjectLocator.instance;
    }

    public registerLocations(sceneName: string, locations: ObjectLocations): void {
        this.locations.set(sceneName, locations);
    }

    public getLocation(sceneName: string, objectKey: string): ObjectPosition | undefined {
        return this.locations.get(sceneName)?.[objectKey];
    }

    public getRandomPosition(scene: Phaser.Scene, padding: number = 0): ObjectPosition {
        return {
            x: Phaser.Math.Between(padding, scene.scale.width - padding),
            y: Phaser.Math.Between(padding, scene.scale.height - padding)
        };
    }

    public centerObject(scene: Phaser.Scene, offsetX: number = 0, offsetY: number = 0): ObjectPosition {
        return {
            x: scene.scale.width / 2 + offsetX,
            y: scene.scale.height / 2 + offsetY,
            relative: { fromCenter: true }
        };
    }

    public getPositionFromConfig(scene: Phaser.Scene, position: ObjectPosition): ObjectPosition {
        if (position.relative?.fromCenter) {
            return {
                x: scene.scale.width / 2 + (position.relative.offsetX ?? 0),
                y: scene.scale.height / 2 + (position.relative.offsetY ?? 0),
                scale: position.scale
            };
        }
        return position;
    }

    public gridPosition(
        _scene: Phaser.Scene,
        row: number,
        col: number,
        cellWidth: number,
        cellHeight: number,
        offsetX: number = 0,
        offsetY: number = 0
    ): ObjectPosition {
        return {
            x: col * cellWidth + cellWidth / 2 + offsetX,
            y: row * cellHeight + cellHeight / 2 + offsetY
        };
    }

    public createGrid(
        scene: Phaser.Scene,
        rows: number,
        cols: number,
        cellWidth: number,
        cellHeight: number,
        offsetX: number = 0,
        offsetY: number = 0
    ): ObjectPosition[] {
        const positions: ObjectPosition[] = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                positions.push(this.gridPosition(scene, row, col, cellWidth, cellHeight, offsetX, offsetY));
            }
        }
        
        return positions;
    }

    public alignToObject(
        _sourceObject: Phaser.GameObjects.GameObject,
        targetObject: Phaser.GameObjects.Components.Transform,
        offsetX: number = 0,
        offsetY: number = 0
    ): ObjectPosition {
        return {
            x: targetObject.x + offsetX,
            y: targetObject.y + offsetY
        };
    }
}
