import { DrawingService } from '@app/services/drawing/drawing.service';
import { SubToolSelected } from './sub-tool-selected';
import { Vec2 } from './vec2';

// tslint:disable:no-empty

export enum ToolUsed {
    NONE = 0,
    Pencil = 1,
    Eraser = 2,
    Brush = 3,
    Line = 4,
    Rectangle = 5,
    Ellipse = 6,
    Polygon = 7,
    PaintBucket = 8,
    Feather = 9,
    Text = 50,
    Color = 1000,
    Dropper = 1003,
    SelectionRectangle = 10010,
    SelectionEllipse = 10021,
    MagicWand = 10023,
    Stamp = 58,
    Grid = 9001,
    Spray = 1004,
}

export abstract class Tool {
    mouseDownCoords: Vec2;
    mouseDown: boolean = false;
    mouseMove: boolean = false;
    subToolSelect: SubToolSelected;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseOut(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    onShiftKeyDown(event: KeyboardEvent): void {}

    onShiftKeyUp(event: KeyboardEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    onKeyEscape(event: KeyboardEvent): void {}

    onKeyBackSpace(event: KeyboardEvent): void {}

    cleanPaintGrout(): void {
        this.clearPath();
        this.clearPreviewCtx();
    }

    protected clearEffectTool(): void {}

    protected clearPath(): void {}
    protected clearPreviewCtx(): void {}
}
