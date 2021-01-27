import { MouseButton } from '@app/classes/mouse-button';

export class EventOfTest {
    mouseEvent: MouseEvent = {
        offsetX: 25,
        offsetY: 10,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEvent1: MouseEvent = {
        offsetX: 0,
        offsetY: 0,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEvent2: MouseEvent = {
        offsetX: 50,
        offsetY: 50,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEvent3: MouseEvent = {
        offsetX: 0,
        offsetY: 10,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEventX499Y500: MouseEvent = {
        offsetX: 499,
        offsetY: 500,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEventOutSate: MouseEvent = {
        offsetX: 9000,
        offsetY: 9000,
        button: MouseButton.Left,
    } as MouseEvent;

    mouseEventR: MouseEvent = {
        offsetX: 0,
        offsetY: 0,
        button: MouseButton.Right,
    } as MouseEvent;

    backSpaceEvent: KeyboardEvent = new KeyboardEvent('backspace');
}
