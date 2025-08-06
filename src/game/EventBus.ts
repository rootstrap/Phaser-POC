import { Events } from 'phaser';

// Event names as a type-safe enum
export enum EventName {
    SCENE_READY = 'current-scene-ready',
}

// Type for event handlers
type EventHandlers = {
    [EventName.SCENE_READY]: (scene: Phaser.Scene) => void;
};

// Enhanced EventBus with type-safe event handling
class TypedEventBus extends Events.EventEmitter {
    public on<K extends EventName>(
        event: K,
        fn: EventHandlers[K],
        context?: any
    ): this {
        return super.on(event, fn, context);
    }

    public emit<K extends EventName>(
        event: K,
        ...args: Parameters<EventHandlers[K]>
    ): boolean {
        return super.emit(event, ...args);
    }

    public removeListener<K extends EventName>(
        event: K,
        fn?: EventHandlers[K],
        context?: any,
        once?: boolean
    ): this {
        return super.removeListener(event, fn, context, once);
    }
}

// Singleton instance for global event communication between React and Phaser
export const EventBus = new TypedEventBus();