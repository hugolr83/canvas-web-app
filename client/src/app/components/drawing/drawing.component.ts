import { AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { cursorName } from '@app/classes/cursor-name';
import {
    RESIZE_CORNER_PROPORTION,
    RESIZE_HOOK_THICKNESS,
    RESIZE_MIDDLE_LOWER_PROPORTION,
    RESIZE_MIDDLE_UPPER_PROPORTION,
} from '@app/classes/resize-canvas';
import { ResizeDirection } from '@app/classes/resize-direction';
import { ToolUsed } from '@app/classes/tool';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterContentInit, AfterViewInit {
    constructor(
        private drawingService: DrawingService,
        public toolService: ToolService,
        public canvasResizeService: CanvasResizeService,
        public colorService: ColorService,
        public undoRedoService: UndoRedoService,
        private automaticSaveService: AutomaticSaveService,
    ) {}

    get width(): number {
        return this.canvasResizeService.canvasSize.x;
    }

    get height(): number {
        return this.canvasResizeService.canvasSize.y;
    }

    get cursorUsed(): string {
        return this.drawingService.cursorUsed;
    }

    get dropper(): ToolUsed.Dropper {
        return ToolUsed.Dropper;
    }

    get stamp(): ToolUsed.Stamp {
        return ToolUsed.Stamp;
    }

    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasResizingPreview', { static: false }) canvasResizingPreview: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridLayer', { static: false }) gridLayer: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorCanvas', { static: false }) cursorCanvas: ElementRef<HTMLCanvasElement>;

    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    private resizeCtx: CanvasRenderingContext2D;

    private cursorCtx: CanvasRenderingContext2D;

    ngAfterContentInit(): void {
        if (this.automaticSaveService.check()) this.automaticSaveService.getUpload();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.resizeCtx = this.canvasResizingPreview.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.gridCanvas = this.gridLayer.nativeElement;
        this.drawingService.gridCtx = this.gridLayer.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.cursorCtx = this.cursorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.cursorCtx = this.cursorCtx;
        this.setCanvasBackgroundColor();
        const event = { offsetX: this.canvasResizeService.DEFAULT_WIDTH, offsetY: this.canvasResizeService.DEFAULT_HEIGHT } as MouseEvent;
        this.undoRedoService.defaultCanvasAction = new ResizeCanvasAction(
            event,
            this.resizeCtx,
            this.baseCanvas.nativeElement,
            ResizeDirection.verticalAndHorizontal,
            this.canvasResizeService,
        );
    }

    setCanvasBackgroundColor(): void {
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.baseCanvas.nativeElement.width, this.baseCanvas.nativeElement.height);
    }

    onMouseDown(event: MouseEvent): void {
        this.toolService.currentTool.onMouseDown(event);
        this.undoRedoService.whileDrawingUndoRedo(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.toolService.currentTool.onMouseMove(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.toolService.currentTool.onMouseUp(event);
        this.undoRedoService.activateUndo(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.toolService.currentTool.onMouseOut(event);
    }
    onMouseEnter(event: MouseEvent): void {
        this.toolService.currentTool.onMouseEnter(event);
    }

    onResizeDown(event: MouseEvent): void {
        const isVertical =
            this.canvasResizeService.canvasSize.y < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isHorizontal =
            this.canvasResizeService.canvasSize.x < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isVerticalAndHorizontal =
            this.canvasResizeService.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x + RESIZE_HOOK_THICKNESS;

        if (isVerticalAndHorizontal) {
            this.canvasResizeService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            this.canvasResizeService.onResizeDown(event, ResizeDirection.verticalAndHorizontal);
            return;
        }
        if (isVertical) {
            this.canvasResizeService.resizeCursor = cursorName.resizeVertical;
            this.canvasResizeService.onResizeDown(event, ResizeDirection.vertical);
            return;
        }
        if (isHorizontal) {
            this.canvasResizeService.resizeCursor = cursorName.resizeHorizontal;
            this.canvasResizeService.onResizeDown(event, ResizeDirection.horizontal);
            return;
        }
    }

    onResizeMove(event: MouseEvent): void {
        if (this.canvasResizeService.isResizeDown) {
            this.canvasResizeService.onResize(event, this.resizeCtx);
        }

        const isVertical =
            this.canvasResizeService.canvasSize.y < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isHorizontal =
            this.canvasResizeService.canvasSize.x < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y * RESIZE_MIDDLE_UPPER_PROPORTION;
        const isVerticalAndHorizontal =
            this.canvasResizeService.canvasSize.y * RESIZE_CORNER_PROPORTION < event.offsetY &&
            event.offsetY < this.canvasResizeService.canvasSize.y + RESIZE_HOOK_THICKNESS &&
            this.canvasResizeService.canvasSize.x * RESIZE_CORNER_PROPORTION < event.offsetX &&
            event.offsetX < this.canvasResizeService.canvasSize.x + RESIZE_HOOK_THICKNESS;

        if (isVerticalAndHorizontal) {
            this.canvasResizeService.resizeCursor = cursorName.resizeVerticalAndHorizontal;
            return;
        }
        if (isVertical) {
            this.canvasResizeService.resizeCursor = cursorName.resizeVertical;
            return;
        }
        if (isHorizontal) {
            this.canvasResizeService.resizeCursor = cursorName.resizeHorizontal;
            return;
        }
    }

    onResizeUp(event: MouseEvent): void {
        this.canvasResizeService.onResizeUp(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onResizeOut(event: MouseEvent): void {
        this.canvasResizeService.onResizeOut(event, this.resizeCtx, this.baseCanvas.nativeElement);
    }

    onMouseOverMainCanvas(event: MouseEvent): void {
        const position = { x: event.offsetX, y: event.offsetY };
        this.colorService.previewColor = this.colorService.numeralToHex(this.colorService.getColor(position, this.baseCtx));
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        if (
            this.toolService.currentToolName === ToolUsed.PaintBucket ||
            this.toolService.currentToolName === ToolUsed.Dropper ||
            this.toolService.currentToolName === ToolUsed.SelectionRectangle ||
            this.toolService.currentToolName === ToolUsed.SelectionEllipse ||
            this.toolService.currentToolName === ToolUsed.MagicWand
        ) {
            event.preventDefault();
        }
    }

    @HostListener('window:keydown.shift', ['$event'])
    onKeyShiftDown(event: KeyboardEvent): void {
        this.toolService.currentTool.onShiftKeyDown(event);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onKeyShiftUp(event: KeyboardEvent): void {
        this.toolService.currentTool.onShiftKeyUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent): void {
        this.toolService.currentTool.onDoubleClick(event);
    }

    @HostListener('window:keydown.escape', ['$event'])
    onKeyEscape(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyEscape(event);
    }

    @HostListener('window:keydown.backspace', ['$event'])
    onKeyBackSpace(event: KeyboardEvent): void {
        this.toolService.currentTool.onKeyBackSpace(event);
    }
}
