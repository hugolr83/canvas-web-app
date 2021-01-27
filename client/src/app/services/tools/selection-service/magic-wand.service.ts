import { Injectable } from '@angular/core';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { SelectionImage } from '@app/classes/selection';
import { SelectionWandAction } from '@app/classes/undo-redo/selection-wand-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismParams, MagnetismService } from '@app/services/tools/magnetism.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RotationService } from './rotation.service';

export enum Bound {
    UPPER,
    LOWER,
    LEFT,
    RIGHT,
    NONE,
}

@Injectable({
    providedIn: 'root',
})

// https://github.com/Tamersoul/magic-wand-js/blob/master/src/MagicWand.js

// This file is larger than 350 lines but is entirely used by the methods.
// tslint:disable:max-file-line-count
// tslint:disable:no-magic-numbers
// tslint:disable:cyclomatic-complexity
export class MagicWandService extends SelectionService {
    private replacementColor: RGBA = { red: 101, green: 231, blue: 0, alpha: 1 };
    private readonly COLORATTRIBUTES: number = 4;
    private rightMouseDown: boolean;
    originalColor: RGBA;

    constructor(
        drawingService: DrawingService,
        protected magnetismService: MagnetismService,
        protected undoRedoService: UndoRedoService,
        protected rotationService: RotationService,
        protected autoSave: AutomaticSaveService,
    ) {
        super(drawingService, magnetismService, rotationService, autoSave);
    }

    // the starting x and y means where the mouse was clicked down
    private selectedFloodFill(x: number, y: number, replacementColor: RGBA): ImageData {
        const pixelStack: Vec2[] = [];
        pixelStack.push({ x, y });
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        let linearCords: number = (y * this.drawingService.canvas.width + x) * this.COLORATTRIBUTES;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        while (pixelStack.length > 0) {
            const newPixel: Vec2 = pixelStack.shift() as Vec2;
            x = newPixel.x;
            y = newPixel.y;

            linearCords = (y * this.drawingService.canvas.width + x) * this.COLORATTRIBUTES;
            while (
                y-- >= 0 &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                linearCords -= this.drawingService.canvas.width * this.COLORATTRIBUTES;
            }
            linearCords += this.drawingService.canvas.width * this.COLORATTRIBUTES;
            y++;

            let reachedLeft = false;
            let reachedRight = false;
            while (
                y++ < this.drawingService.canvas.height &&
                pixels.data[linearCords] === originalColor.red &&
                pixels.data[linearCords + 1] === originalColor.green &&
                pixels.data[linearCords + 2] === originalColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] === originalColor.alpha
            ) {
                pixels.data[linearCords] = replacementColor.red;
                pixels.data[linearCords + 1] = replacementColor.green;
                pixels.data[linearCords + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[linearCords + 3] = replacementColor.alpha;

                if (x > 0) {
                    if (
                        pixels.data[linearCords - this.COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords - this.COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords - this.COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords - this.COLORATTRIBUTES + 3] === originalColor.alpha
                    ) {
                        if (!reachedLeft) {
                            pixelStack.push({ x: x - 1, y });
                            reachedLeft = true;
                        } else if (reachedLeft) {
                            reachedLeft = false;
                        }
                    }
                }

                if (x < this.drawingService.canvas.width - 1) {
                    if (
                        pixels.data[linearCords + this.COLORATTRIBUTES] === originalColor.red &&
                        pixels.data[linearCords + this.COLORATTRIBUTES + 1] === originalColor.green &&
                        pixels.data[linearCords + this.COLORATTRIBUTES + 2] === originalColor.blue &&
                        // +3 means at alpha position
                        // tslint:disable-next-line:no-magic-numbers
                        pixels.data[linearCords + this.COLORATTRIBUTES + 3] === originalColor.alpha
                    ) {
                        if (!reachedRight) {
                            pixelStack.push({ x: x + 1, y });
                            reachedRight = true;
                        } else if (reachedRight) {
                            reachedRight = false;
                        }
                    }

                    linearCords += this.drawingService.canvas.width * this.COLORATTRIBUTES;
                }
            }
        }
        return pixels;
    }

    private matchFillColor(currentColor: RGBA, targetColor: RGBA): boolean {
        let matchFillColor = true;
        matchFillColor = matchFillColor && targetColor.red === currentColor.red;
        matchFillColor = matchFillColor && targetColor.green === currentColor.green;
        matchFillColor = matchFillColor && targetColor.blue === currentColor.blue;

        return matchFillColor;
    }

    private selectAllSimilar(x: number, y: number, replacementColor: RGBA): ImageData {
        const pixels: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const linearCords: number = (y * this.drawingService.canvas.width + x) * this.COLORATTRIBUTES;
        const originalColor = {
            red: pixels.data[linearCords],
            green: pixels.data[linearCords + 1],
            blue: pixels.data[linearCords + 2],
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            alpha: pixels.data[linearCords + 3],
        };

        let iterator = 0;
        const atIteratorColor: RGBA = { red: 0, green: 0, blue: 0, alpha: 0 };
        while (iterator <= pixels.data.length) {
            atIteratorColor.red = pixels.data[iterator];
            atIteratorColor.green = pixels.data[iterator + 1];
            atIteratorColor.blue = pixels.data[iterator + 2];
            // +3 means at alpha position
            // tslint:disable-next-line:no-magic-numbers
            atIteratorColor.alpha = pixels.data[iterator + 3];
            if (this.matchFillColor(originalColor, atIteratorColor)) {
                // put selection code
                pixels.data[iterator] = replacementColor.red;
                pixels.data[iterator + 1] = replacementColor.green;
                pixels.data[iterator + 2] = replacementColor.blue;
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                pixels.data[iterator + 3] = replacementColor.alpha;
            }
            iterator += this.COLORATTRIBUTES;
        }

        return pixels;
    }

    private preparePreviewLayer(coloredPixels: ImageData): ImageData {
        const size = coloredPixels.width * coloredPixels.height;
        const originalLayer: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
        );
        const previewLayer = new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height);
        for (let i = 0; i < size; ++i) {
            if (
                coloredPixels.data[i * this.COLORATTRIBUTES] === this.replacementColor.red &&
                coloredPixels.data[i * this.COLORATTRIBUTES + 1] === this.replacementColor.green &&
                coloredPixels.data[i * this.COLORATTRIBUTES + 2] === this.replacementColor.blue &&
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                coloredPixels.data[i * this.COLORATTRIBUTES + 3] === this.replacementColor.alpha
            ) {
                previewLayer.data[i * this.COLORATTRIBUTES] = originalLayer.data[i * this.COLORATTRIBUTES];
                previewLayer.data[i * this.COLORATTRIBUTES + 1] = originalLayer.data[i * this.COLORATTRIBUTES + 1];
                previewLayer.data[i * this.COLORATTRIBUTES + 2] = originalLayer.data[i * this.COLORATTRIBUTES + 2];
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = originalLayer.data[i * this.COLORATTRIBUTES + 3];
            } else {
                // +3 means at alpha position
                // tslint:disable-next-line:no-magic-numbers
                previewLayer.data[i * this.COLORATTRIBUTES + 3] = 0;
            }
        }
        return previewLayer;
    }

    private checkNotTransparentPixel(previewLayer: ImageData, pixelPosition: number, transparentColor: RGBA): boolean {
        return (
            // tslint:disable-next-line:no-magic-numbers
            previewLayer.data[pixelPosition + 3] !== transparentColor.alpha
        );
    }

    private findBound(bound: Bound, previewLayer: ImageData): Vec2 {
        const transparent: RGBA = { red: 255, green: 255, blue: 255, alpha: 0 };
        switch (bound) {
            case Bound.UPPER:
                // go thru all of the lines FROM THE TOP and...
                for (let i = 0; i < previewLayer.height; ++i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.width; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (i * previewLayer.width + j), transparent)) {
                            return { x: -1, y: i };
                        }
                    }
                }
            case Bound.LOWER:
                // go thru all of the lines FROM THE BOTTOM and...
                for (let i = previewLayer.height - 1; i >= 0; --i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.width; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (i * previewLayer.width + j), transparent)) {
                            return { x: -1, y: i };
                        }
                    }
                }
            case Bound.LEFT:
                // go thru all of the columns FROM THE LEFT and ...
                for (let i = 0; i < previewLayer.width; ++i) {
                    // scan the current column to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.height; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (j * previewLayer.width + i), transparent)) {
                            return { x: i, y: -1 };
                        }
                    }
                }
            case Bound.RIGHT:
                // go thru all of the columns FROM THE RIGHT and ...
                for (let i = previewLayer.width - 1; i >= 0; --i) {
                    // scan the current line to find a pixel NOT transparent
                    for (let j = 0; j < previewLayer.height; ++j) {
                        if (this.checkNotTransparentPixel(previewLayer, this.COLORATTRIBUTES * (j * previewLayer.width + i), transparent)) {
                            return { x: i, y: -1 };
                        }
                    }
                }
        }
        return { x: NaN, y: NaN };
    }

    // https://stackoverflow.com/a/55196211
    private snipSelection(previewLayer: ImageData, upperCornerPosition: Vec2, selectionDimension: Vec2): string {
        const cut = document.createElement('canvas');
        cut.width = selectionDimension.x;
        cut.height = selectionDimension.y;
        const ctx = cut.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(previewLayer, -upperCornerPosition.x, -upperCornerPosition.y);
        this.selection.imageData = ctx.getImageData(0, 0, cut.width, cut.height);
        return cut.toDataURL();
    }

    private saveSelectionData(coloredPixels: ImageData): void {
        // the next steps removes anything other than the selected pixels to become transparent
        // and it keeps the selected pixels in the layer
        const previewLayer: ImageData = this.preparePreviewLayer(coloredPixels);

        const upperBoundPos: Vec2 = this.findBound(Bound.UPPER, previewLayer);
        const lowerBoundPos: Vec2 = this.findBound(Bound.LOWER, previewLayer);
        const leftBoundPos: Vec2 = this.findBound(Bound.LEFT, previewLayer);
        const rightBoundPos: Vec2 = this.findBound(Bound.RIGHT, previewLayer);

        this.selection.imagePosition = { x: leftBoundPos.x, y: upperBoundPos.y } as Vec2;
        this.selection.endingPos = { x: rightBoundPos.x, y: lowerBoundPos.y } as Vec2;

        this.selection.image = new Image();
        if (rightBoundPos.x - leftBoundPos.x !== 0 && lowerBoundPos.y - upperBoundPos.y !== 0) {
            this.selection.image.src = this.snipSelection(
                previewLayer,
                this.selection.imagePosition as Vec2,
                { x: rightBoundPos.x - leftBoundPos.x, y: lowerBoundPos.y - upperBoundPos.y } as Vec2,
            );
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.mouseDown = event.button === MouseButton.Left;
        this.rightMouseDown = event.button === MouseButton.Right;

        if (this.mouseDown) {
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.previousMousePos = this.getPositionFromMouse(event);
            // check if mouse is inside selection
            if (this.selection.imagePosition && this.selection.endingPos && !this.drawingService.isPreviewCanvasBlank()) {
                this.inSelection = this.isInsideSelectionCoords(this.mouseDownCoords);
            }

            // check if mouse is inside a control point
            if (!this.drawingService.isPreviewCanvasBlank()) {
                this.controlPointName = this.controlGroup.isInControlPoint(this.mouseDownCoords);
            }

            if (this.controlPointName === ControlPointName.none && !this.inSelection && this.drawingService.isPreviewCanvasBlank()) {
                const coloredToBeSelectedPixels: ImageData = this.selectedFloodFill(event.offsetX, event.offsetY, this.replacementColor);
                this.saveSelectionData(coloredToBeSelectedPixels);
                this.originalColor = this.getColor({ x: event.offsetX, y: event.offsetY }, this.drawingService.baseCtx);
                // this.colorPosition = { x: event.offsetX, y: event.offsetY };
                this.selection.copyImageInitialPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
                this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
                this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
                this.selection.imageSize = { x: this.selection.width, y: this.selection.height };
                this.controlGroup = new ControlGroup(this.drawingService);
                this.baseImage = new Image();
                this.baseImage.src = this.selection.image.src;
                this.drawWandSelection();
                this.mouseDown = false;
                return;
            }

            if (!this.inSelection && this.controlPointName === ControlPointName.none && !this.drawingService.isPreviewCanvasBlank()) {
                this.cleared = false;
                // undo redo
                const selectWandAc = new SelectionWandAction(this, this.drawingService, this.selection, this.originalColor);
                this.undoRedoService.addUndo(selectWandAc);
                this.undoRedoService.clearRedo();
                this.pasteSelection(this.selection);
                return;
            }
        }

        // The entire canvas is being verified if the target color plus tolerance can be colored with the replacement color.
        if (this.rightMouseDown) {
            const coloredToBeSelectedPixels: ImageData = this.selectAllSimilar(event.offsetX, event.offsetY, this.replacementColor);
            this.saveSelectionData(coloredToBeSelectedPixels);
            // this.colorPosition = { x: event.offsetX, y: event.offsetY };
            this.originalColor = this.getColor({ x: event.offsetX, y: event.offsetY }, this.drawingService.baseCtx);
            this.selection.copyImageInitialPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            this.selection.width = this.selection.endingPos.x - this.selection.imagePosition.x;
            this.selection.height = this.selection.endingPos.y - this.selection.imagePosition.y;
            this.selection.imageSize = { x: this.selection.width, y: this.selection.height };
            this.controlGroup = new ControlGroup(this.drawingService);
            this.baseImage = new Image();
            this.baseImage.src = this.selection.image.src;
            this.drawWandSelection();
            this.rightMouseDown = false;
            return;
        }
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
                this.drawWandSelection();

                this.previousMousePos = mousePosition;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelectionWand(this.selection.copyImageInitialPos, this.originalColor);
                    this.cleared = true;
                }

                // scale selection
            } else if (this.controlPointName !== ControlPointName.none) {
                this.mouseMovement.x = mousePosition.x - this.previousMousePos.x;
                this.mouseMovement.y = mousePosition.y - this.previousMousePos.y;

                // bypass bug clear selection
                if (!this.cleared) {
                    this.clearSelectionWand(this.selection.copyImageInitialPos, this.originalColor);
                    this.cleared = true;
                }

                this.scaleSelection(this.mouseMovement);
                this.drawWandSelection();
                this.previousMousePos = mousePosition;
                // draw selection
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.inSelection || this.controlPointName !== ControlPointName.none) {
                this.drawWandSelection();
                this.mouseMovement = { x: 0, y: 0 };
                this.selection.imagePosition = this.updateSelectionPositions();
                // reset baseImage to use when flipping the image
                this.baseImage = new Image();
                this.baseImage.src = this.selection.image.src;
            }
        }
        this.mouseDown = false;
        this.rightMouseDown = false;
        this.inSelection = false;
    }

    onKeyEscape(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            // paste image
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // if the user is pressing escape while moving the selection
            if (
                this.mouseDown ||
                this.leftArrow.arrowPressed ||
                this.rightArrow.arrowPressed ||
                this.upArrow.arrowPressed ||
                this.downArrow.arrowPressed
            ) {
                this.selection.imagePosition = {
                    x: this.selection.imagePosition.x + this.mouseMovement.x,
                    y: this.selection.imagePosition.y + this.mouseMovement.y,
                };
            }

            // undo redo
            const selectWandAc = new SelectionWandAction(this, this.drawingService, this.selection, this.originalColor);
            this.undoRedoService.addUndo(selectWandAc);
            this.undoRedoService.clearRedo();
            // paste image
            this.pasteSelection(this.selection);
            this.mouseMovement = { x: 0, y: 0 };
            this.isAllSelect = false;
            this.selection.endingPos = this.selection.imagePosition = this.mouseDownCoords;
            this.cleared = false;

            this.mouseDown = false;
            if (this.downArrow.timerStarted) {
                this.downArrow.subscription.unsubscribe();
            }
            if (this.leftArrow.timerStarted) {
                this.leftArrow.subscription.unsubscribe();
            }
            if (this.rightArrow.timerStarted) {
                this.rightArrow.subscription.unsubscribe();
            }
            if (this.upArrow.timerStarted) {
                this.upArrow.subscription.unsubscribe();
            }
            if (this.timerStarted) {
                this.subscriptionTimer.unsubscribe();
            }
        }
    }

    drawWandSelection(): void {
        if (this.scaled) {
            this.flipImage();
            this.scaled = false;
        }
        this.drawingService.previewCtx.save();
        if (this.selection.rotationAngle !== 0) {
            this.rotationService.rotateSelection(this.selection, this.drawingService.previewCtx);
        }
        this.drawingService.previewCtx.drawImage(
            this.selection.image,
            this.selection.imagePosition.x,
            this.selection.imagePosition.y,
            this.selection.width,
            this.selection.height,
        );
        this.drawingService.previewCtx.restore();
        this.drawSelectionRect(this.selection.imagePosition, this.selection.width, this.selection.height);
    }

    pasteSelection(selection: SelectionImage): void {
        this.drawingService.baseCtx.save();
        this.rotationService.rotateSelection(this.selection, this.drawingService.baseCtx);
        this.drawingService.baseCtx.drawImage(
            selection.image,
            selection.imagePosition.x,
            selection.imagePosition.y,
            selection.width,
            selection.height,
        );
        this.drawingService.baseCtx.restore();
        this.selection.resetAngle();
        this.autoSave.save();
    }

    clearSelectionWand(position: Vec2, originalColor: RGBA): void {
        const tmpImageData = this.drawingService.baseCtx.getImageData(position.x, position.y, this.selection.width + 1, this.selection.height + 1);
        for (let i = 0 as number; i <= tmpImageData.data.length; i += 4) {
            // is this pixel the old rgb?
            if (
                tmpImageData.data[i] === originalColor.red &&
                tmpImageData.data[i + 1] === originalColor.green &&
                tmpImageData.data[i + 2] === originalColor.blue &&
                tmpImageData.data[i + 3] !== 0
            ) {
                // change to your new rgb

                tmpImageData.data[i] = 255;
                tmpImageData.data[i + 1] = 255;
                tmpImageData.data[i + 2] = 255;
                tmpImageData.data[i + 3] = 255;
            }
        }

        this.drawingService.baseCtx.putImageData(tmpImageData, position.x, position.y);
    }

    clearSelection(): void {
        this.clearSelectionWand(this.selection.copyImageInitialPos, this.originalColor);
    }

    private getColor(position: Vec2, ctx: CanvasRenderingContext2D): RGBA {
        const imageData = ctx.getImageData(position.x, position.y, 1, 1).data;
        return { red: imageData[0], green: imageData[1], blue: imageData[2], alpha: imageData[3] };
    }

    drawSelection(imagePosition: Vec2): void {
        this.drawWandSelection();
    }
}
