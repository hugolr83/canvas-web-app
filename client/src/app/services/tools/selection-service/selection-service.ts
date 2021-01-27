import { Injectable } from '@angular/core';
import { ArrowInfo, MOVEMENT_DELAY, PIXEL_MOVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { FlipDirection } from '@app/classes/flip-direction';
import { ImageClipboard } from '@app/classes/image-clipboard';
import { SelectionImage } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismParams, MagnetismService } from '@app/services/tools/magnetism.service';
import { interval, Subscription } from 'rxjs';
import { RotationService } from './rotation.service';

export const LINE_WIDTH = 1;
export const DOTTED_SPACE = 10;
@Injectable({
    providedIn: 'root',
})

// private undoRedoService: UndoRedoService
// The below is justified because the methods are implemented by their children.
// tslint:disable:no-empty
// This file is larger than 350 lines but is entirely used by the methods.
// tslint:disable:max-file-line-count
export class SelectionService extends Tool {
    constructor(
        drawingService: DrawingService,
        protected magnetismService: MagnetismService,
        protected rotationService: RotationService,
        protected autoSave: AutomaticSaveService,
    ) {
        super(drawingService);
    }
    // initialization of local const
    protected shiftPressed: boolean = false;
    protected scaled: boolean = false;

    // images infos used for flipping the image
    protected baseImage: HTMLImageElement;
    protected baseImageData: ImageData;
    protected baseSize: Vec2;
    mouseMovement: Vec2 = { x: 0, y: 0 };

    // selection
    selection: SelectionImage = new SelectionImage(this.drawingService);
    protected inSelection: boolean = false;
    protected isAllSelect: boolean = false;
    protected previousMousePos: Vec2 = { x: 0, y: 0 };

    // initialization of variables needed for arrow movement
    protected leftArrow: ArrowInfo = new ArrowInfo({ x: -PIXEL_MOVEMENT, y: 0 }, this.drawingService, this, this.magnetismService);
    protected rightArrow: ArrowInfo = new ArrowInfo({ x: +PIXEL_MOVEMENT, y: 0 }, this.drawingService, this, this.magnetismService);
    protected upArrow: ArrowInfo = new ArrowInfo({ x: 0, y: -PIXEL_MOVEMENT }, this.drawingService, this, this.magnetismService);
    protected downArrow: ArrowInfo = new ArrowInfo({ x: 0, y: +PIXEL_MOVEMENT }, this.drawingService, this, this.magnetismService);
    protected subscriptionTimer: Subscription;
    time: number = 0;
    protected timerStarted: boolean = false;

    // bypass clear selection bug
    cleared: boolean = false;

    // initialization clipboard
    private clipboard: ImageClipboard = new ImageClipboard();

    // Control points
    protected controlGroup: ControlGroup;
    protected controlPointName: ControlPointName = ControlPointName.none;
    private flip: FlipDirection = FlipDirection.none;

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // draw selection
            if (
                this.selection.imagePosition.x !== this.selection.endingPos.x &&
                this.selection.imagePosition.y !== this.selection.endingPos.y &&
                !this.inSelection &&
                this.controlPointName === ControlPointName.none
            ) {
                this.selection.endingPos = mousePosition;
                if (!this.shiftPressed) {
                    this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
                    this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
                }

                if (this.selection.width !== 0 && this.selection.height !== 0) {
                    this.copySelection();
                    this.baseSize = { x: this.selection.width, y: this.selection.height };
                    this.selection.imageSize = { x: this.selection.width, y: this.selection.height };
                    this.selection.imagePosition = this.selection.copyImageInitialPos = this.updateSelectionPositions();

                    // initialization of controls points
                    this.controlGroup = new ControlGroup(this.drawingService);
                    this.drawSelection(this.selection.imagePosition);
                    this.cleared = false;
                }

                this.magnetismService.resetMagnetism();

                // move or scale selection
            } else if (this.inSelection || this.controlPointName !== ControlPointName.none) {
                this.drawSelection(this.selection.imagePosition);
                this.mouseMovement = { x: 0, y: 0 };
                this.selection.imagePosition = this.updateSelectionPositions();

                // reset baseImage to use when flipping the image
                this.baseImage = new Image();
                this.baseImage.src = this.selection.image.src;
                // not in action anymore
                // this.controlGroup.resetSelected();
            }
        }
        // this.controlPointName = ControlPointName.none;
        this.mouseDown = false;
        this.inSelection = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // move selection
            if (this.inSelection && this.controlPointName === ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;
                this.selection.imagePosition = {
                    x: this.selection.imagePosition.x + this.mouseMovement.x,
                    y: this.selection.imagePosition.y + this.mouseMovement.y,
                };
                this.selection.endingPos = {
                    x: this.selection.endingPos.x + this.mouseMovement.x,
                    y: this.selection.endingPos.y + this.mouseMovement.y,
                };

                // press "m" to activate the magnetism and sure there is a controlPointName selected
                // this controlPointName is different from the one in selection service, as one if for resizing purpose
                // and the following for the magnetism
                if (this.controlGroup.controlPointName !== ControlPointName.none) {
                    const magnetismReturn = this.magnetismService.applyMagnetismMouseMove({
                        imagePosition: this.selection.imagePosition,
                        endingPosition: this.selection.endingPos,
                        controlGroup: this.controlGroup,
                        selectionSize: { x: this.selection.width, y: this.selection.height } as Vec2,
                    } as MagnetismParams);

                    this.selection.imagePosition = magnetismReturn.imagePosition;
                    this.selection.endingPos = magnetismReturn.endingPosition;
                    this.controlGroup = magnetismReturn.controlGroup;
                }
                this.drawSelection(this.selection.imagePosition);

                this.previousMousePos = mousePosition;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection();
                    this.cleared = true;
                }

                // scale selection
            } else if (this.controlPointName !== ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelection();
                    this.cleared = true;
                }

                this.scaleSelection(this.mouseMovement);
                this.drawSelection(this.selection.imagePosition);
                this.previousMousePos = mousePosition;
                // draw selection
            } else {
                this.selection.endingPos = mousePosition;
                this.drawPreview();
            }
        }
    }

    onKeyEscape(event: KeyboardEvent): void {}

    onMouseOut(event: MouseEvent): void {
        if (this.mouseDown && this.inSelection) {
            this.selection.imagePosition = this.selection.copyImageInitialPos;
            this.pasteSelection(this.selection);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else {
            this.onMouseUp(event);
        }

        this.mouseDown = false;
    }

    onShiftKeyDown(event: KeyboardEvent): void {
        this.shiftPressed = true;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.selection.ellipseRadian = {
                x: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
                y: Math.min(Math.abs(this.selection.width / 2), Math.abs(this.selection.height / 2)),
            };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    onShiftKeyUp(event: KeyboardEvent): void {
        this.shiftPressed = false;
        if (this.mouseDown && !this.inSelection && this.controlPointName === ControlPointName.none) {
            this.selection.ellipseRadian = { x: Math.abs(this.selection.width / 2), y: Math.abs(this.selection.height / 2) };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        }
    }

    clearEffectTool(): void {
        this.drawingService.baseCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.previewCtx.shadowColor = 'rgba(0,0,0,0)';
        this.drawingService.baseCtx.strokeStyle = '#000000';
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.baseCtx.lineJoin = 'miter';
        this.drawingService.baseCtx.lineCap = 'square';
        this.drawingService.previewCtx.lineJoin = 'miter';
        this.drawingService.previewCtx.lineCap = 'square';
    }

    selectAll(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pasteSelection(this.selection);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.isAllSelect = true;
        this.selection.width = this.drawingService.canvas.width;
        this.selection.height = this.drawingService.canvas.height;
        this.selection.endingPos = { x: this.selection.width, y: this.selection.height };
        this.selection.imagePosition = this.selection.copyImageInitialPos = { x: 1, y: 1 };
        this.controlGroup = new ControlGroup(this.drawingService);
        this.drawSelectionRect({ x: 1, y: 1 }, this.selection.width, this.selection.height);
        this.copySelection();
        this.drawSelection({ x: 0, y: 0 });
        this.cleared = false;
    }

    protected drawPreviewRect(ctx: CanvasRenderingContext2D, shiftPressed: boolean): void {
        if (this.selection.imagePosition !== this.selection.endingPos) {
            ctx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
            if (shiftPressed) {
                const distanceX = this.selection.endingPos.x - this.selection.imagePosition.x;
                const distanceY = this.selection.endingPos.y - this.selection.imagePosition.y;
                // calculate width and height while keeping sign
                this.selection.height = Math.sign(distanceY) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
                this.selection.width = Math.sign(distanceX) * Math.min(Math.abs(distanceX), Math.abs(distanceY));
            } else {
                this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
                this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
            }
            ctx.strokeRect(this.selection.imagePosition.x, this.selection.imagePosition.y, this.selection.width, this.selection.height);
        }
    }

    protected drawSelectionRect(mouseDownCoords: Vec2, width: number, height: number): void {
        this.drawingService.previewCtx.setLineDash([DOTTED_SPACE, DOTTED_SPACE]);
        this.drawingService.previewCtx.strokeRect(mouseDownCoords.x, mouseDownCoords.y, width, height);
        this.drawingService.previewCtx.setLineDash([]);

        this.controlGroup.setPositions(this.selection.imagePosition, this.selection.endingPos, { x: this.selection.width, y: this.selection.height });

        this.controlGroup.draw();
    }

    protected copySelection(): void {
        this.selection.getImage({ x: this.selection.width, y: this.selection.height });
        this.baseImageData = this.selection.imageData;
        this.baseImage = new Image();
        this.baseImage.src = this.selection.getImageURL(this.baseImageData, this.selection.width, this.selection.height);
    }

    protected pasteSelection(selection: SelectionImage): void {}

    protected updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.selection.endingPos.x - this.selection.imagePosition.x);
        const ySign = Math.sign(this.selection.endingPos.y - this.selection.imagePosition.y);
        const tmpEndPos = this.selection.endingPos;

        this.selection.width = Math.abs(this.selection.width);
        this.selection.height = Math.abs(this.selection.height);

        if (xSign > 0 && ySign > 0) {
            return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
        }
        if (xSign > 0 && ySign < 0) {
            this.selection.endingPos = { x: this.selection.endingPos.x, y: this.selection.imagePosition.y };
            return { x: this.selection.imagePosition.x, y: tmpEndPos.y };
        }
        if (xSign < 0 && ySign < 0) {
            this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            return { x: tmpEndPos.x, y: tmpEndPos.y };
        } else {
            this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.endingPos.y };
            return { x: tmpEndPos.x, y: this.selection.imagePosition.y };
        }
    }

    protected isInsideSelectionCoords(mouse: Vec2): boolean {
        if (
            this.selection.imagePosition.x !== 0 &&
            this.selection.imagePosition.x !== 0 &&
            this.selection.endingPos.x !== 0 &&
            this.selection.endingPos.y !== 0 &&
            !this.drawingService.isPreviewCanvasBlank()
        ) {
            const minX = Math.min(this.selection.endingPos.x, this.selection.imagePosition.x);
            const maxX = Math.max(this.selection.endingPos.x, this.selection.imagePosition.x);
            const minY = Math.min(this.selection.endingPos.y, this.selection.imagePosition.y);
            const maxY = Math.max(this.selection.endingPos.y, this.selection.imagePosition.y);

            if (mouse.x > minX && mouse.x < maxX && mouse.y > minY && mouse.y < maxY) {
                return true;
            }
        }
        return false;
    }

    protected drawPreview(): void {}

    drawSelection(imagePosition: Vec2): void {}

    clearSelection(): void {}

    onLeftArrow(): void {
        this.leftArrow.onArrowDown(this.controlGroup);
    }

    onRightArrow(): void {
        this.rightArrow.onArrowDown(this.controlGroup);
    }

    onUpArrow(): void {
        this.upArrow.onArrowDown(this.controlGroup);
    }

    onDownArrow(): void {
        this.downArrow.onArrowDown(this.controlGroup);
    }

    onLeftArrowUp(): void {
        this.leftArrow.onArrowUp();
    }

    onRightArrowUp(): void {
        this.rightArrow.onArrowUp();
    }

    onDownArrowUp(): void {
        this.downArrow.onArrowUp();
    }

    onUpArrowUp(): void {
        this.upArrow.onArrowUp();
    }

    startTimer(): void {
        if (!this.timerStarted) {
            this.timerStarted = true;
            const mainTimer = interval(MOVEMENT_DELAY);
            this.subscriptionTimer = mainTimer.subscribe(() => (this.time += MOVEMENT_DELAY));
        }
    }

    resetTimer(): void {
        if (
            !this.upArrow.arrowPressed &&
            !this.downArrow.arrowPressed &&
            !this.leftArrow.arrowPressed &&
            !this.rightArrow.arrowPressed &&
            this.timerStarted
        ) {
            this.subscriptionTimer.unsubscribe();
            this.timerStarted = false;
            this.time = 0;
        }
    }

    copyImage(): void {
        this.clipboard.imageData = this.selection.imageData;
        this.clipboard.image = new Image();
        this.clipboard.image.src = this.selection.getImageURL(this.clipboard.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
        this.clipboard.imagePosition = this.selection.imagePosition;
        this.clipboard.width = this.selection.width;
        this.clipboard.height = this.selection.height;
        this.clipboard.ellipseRadian = { x: this.selection.ellipseRadian.x, y: this.selection.ellipseRadian.y };
        this.clipboard.imageSize = { x: this.selection.imageSize.x, y: this.selection.imageSize.y };
        this.clipboard.end = this.selection.endingPos;
    }

    cutImage(): void {
        // this.clipboard.cutImage();
        if (!this.cleared) {
            this.clearSelection();
            this.cleared = true;
        }

        this.copyImage();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    deleteImage(): void {
        // this.clipboard.deleteImage();
        this.clearSelection();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    pasteImage(): void {
        if (this.clipboard.imageSize !== undefined) {
            if (!this.drawingService.isPreviewCanvasBlank()) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pasteSelection(this.selection);
            }
            this.cleared = true;
            this.selection.imageData = this.clipboard.imageData;
            this.selection.imagePosition = { x: 1, y: 1 };
            this.selection.width = this.clipboard.width;
            this.selection.height = this.clipboard.height;
            this.selection.imageSize = { x: this.clipboard.imageSize.x, y: this.clipboard.imageSize.y };
            this.selection.ellipseRadian = { x: this.clipboard.ellipseRadian.x, y: this.clipboard.ellipseRadian.y };
            this.selection.endingPos = { x: Math.abs(this.selection.width), y: Math.abs(this.selection.height) };
            this.selection.image = new Image();
            this.selection.image.src = this.selection.getImageURL(this.clipboard.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
            this.drawSelection({ x: 1, y: 1 });
        }
    }

    // tslint:disable:cyclomatic-complexity
    protected scaleSelection(mouseMovement: Vec2): void {
        if (!this.shiftPressed) {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.selection.ellipseRadian.y -= mouseMovement.y / 2;
                    this.selection.height -= mouseMovement.y;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.selection.ellipseRadian.y += mouseMovement.y / 2;
                    this.selection.height += mouseMovement.y;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.selection.ellipseRadian.x -= mouseMovement.x / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.imagePosition.x += mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.selection.ellipseRadian.x += mouseMovement.x / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.endingPos.x += mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.selection.ellipseRadian.x -= mouseMovement.x / 2;
                    this.selection.ellipseRadian.y -= mouseMovement.y / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.height -= mouseMovement.y;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.selection.ellipseRadian.x += mouseMovement.x / 2;
                    this.selection.ellipseRadian.y -= mouseMovement.y / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.height -= mouseMovement.y;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomRight:
                    this.selection.ellipseRadian.x -= mouseMovement.x / 2;
                    this.selection.ellipseRadian.y += mouseMovement.y / 2;
                    this.selection.width -= mouseMovement.x;
                    this.selection.height += mouseMovement.y;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
                case ControlPointName.bottomLeft:
                    this.selection.ellipseRadian.x += mouseMovement.x / 2;
                    this.selection.ellipseRadian.y += mouseMovement.y / 2;
                    this.selection.width += mouseMovement.x;
                    this.selection.height += mouseMovement.y;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    break;
            }
        } else {
            switch (this.controlPointName) {
                case ControlPointName.top:
                    this.selection.ellipseRadian.y -= mouseMovement.y;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.bottom:
                    this.selection.ellipseRadian.y += mouseMovement.y;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    break;
                case ControlPointName.left:
                    this.selection.ellipseRadian.x -= mouseMovement.x;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.right:
                    this.selection.ellipseRadian.x += mouseMovement.x;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.topLeft:
                    this.selection.ellipseRadian.x -= mouseMovement.x;
                    this.selection.ellipseRadian.y -= mouseMovement.y;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.x -= mouseMovement.x;
                    this.selection.endingPos.y -= mouseMovement.y;
                    break;
                case ControlPointName.topRight:
                    this.selection.ellipseRadian.x += mouseMovement.x;
                    this.selection.ellipseRadian.y -= mouseMovement.y;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.height -= mouseMovement.y * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.imagePosition.y += mouseMovement.y;
                    this.selection.endingPos.y -= mouseMovement.y;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomLeft:
                    this.selection.ellipseRadian.x -= mouseMovement.x;
                    this.selection.ellipseRadian.y += mouseMovement.y;
                    this.selection.width -= mouseMovement.x * 2;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.imagePosition.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    this.selection.endingPos.x -= mouseMovement.x;
                    break;
                case ControlPointName.bottomRight:
                    this.selection.ellipseRadian.x += mouseMovement.x;
                    this.selection.ellipseRadian.y += mouseMovement.y;
                    this.selection.width += mouseMovement.x * 2;
                    this.selection.height += mouseMovement.y * 2;
                    this.selection.endingPos.x += mouseMovement.x;
                    this.selection.endingPos.y += mouseMovement.y;
                    this.selection.imagePosition.x -= mouseMovement.x;
                    this.selection.imagePosition.y -= mouseMovement.y;
                    break;
            }
        }

        this.scaled = true;
        // this.flip = this.flipDirection(this.selection);
    }

    protected flipImage(): void {
        if (this.selection.width < 0 && this.selection.height < 0 && this.flip !== FlipDirection.diagonal) {
            this.flip = FlipDirection.diagonal;
            this.saveFlippedImage({ x: -1, y: -1 }, this.selection.imageSize);
            return;
        }
        if (this.selection.width > 0 && this.selection.height < 0 && this.flip !== FlipDirection.vertical) {
            this.saveFlippedImage({ x: 1, y: -1 }, { x: 0, y: this.selection.imageSize.y });
            this.flip = FlipDirection.vertical;
            return;
        }
        if (this.selection.width < 0 && this.selection.height > 0 && this.flip !== FlipDirection.horizontal) {
            this.saveFlippedImage({ x: -1, y: 1 }, { x: this.selection.imageSize.x, y: 0 });
            this.flip = FlipDirection.horizontal;
            return;
        }
        if (this.selection.width > 0 && this.selection.height > 0 && this.flip !== FlipDirection.none) {
            this.flip = FlipDirection.none;
            this.saveFlippedImage({ x: 1, y: 1 }, { x: 0, y: 0 });
        }
    }

    protected saveFlippedImage(scale: Vec2, translation: Vec2): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = (canvas.getContext('2d') as CanvasRenderingContext2D) as CanvasRenderingContext2D;
        canvas.width = Math.abs(this.selection.imageSize.x);
        canvas.height = Math.abs(this.selection.imageSize.y);
        ctx.save();
        ctx.translate(translation.x, translation.y);
        ctx.scale(scale.x, scale.y);
        // rotate

        ctx.drawImage(this.baseImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        this.selection.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.selection.image = new Image();
        this.selection.image.src = this.selection.getImageURL(this.selection.imageData, this.selection.imageSize.x, this.selection.imageSize.y);
    }
}
