import { Injectable } from '@angular/core';
import { ControlPointName } from '@app/classes/control-points';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionImage } from '@app/classes/selection';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { LINE_WIDTH, SelectionService } from '@app/services/tools/selection-service/selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionRectangleService extends SelectionService {
    constructor(
        drawingService: DrawingService,
        protected magnetismService: MagnetismService,
        protected rotationService: RotationService,
        private undoRedoService: UndoRedoService,
        protected autoSave: AutomaticSaveService,
    ) {
        super(drawingService, magnetismService, rotationService, autoSave);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearEffectTool();
        this.drawingService.previewCtx.lineWidth = LINE_WIDTH;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'black';

        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            this.mouseDownCoords = this.getPositionFromMouse(event);
            this.previousMousePos = this.getPositionFromMouse(event);

            // check if mouse is inside selection
            if (this.selection.imagePosition && this.selection.endingPos) {
                this.inSelection = this.isInsideSelectionCoords(this.mouseDownCoords);
            }

            // check if mouse is inside a control point
            if (!this.drawingService.isPreviewCanvasBlank()) {
                this.controlPointName = this.controlGroup.isInControlPoint(this.mouseDownCoords);
            }

            // to draw preview
            if (this.drawingService.isPreviewCanvasBlank()) {
                this.selection.imagePosition = this.mouseDownCoords;

                // to  paste selection
            } else if (!this.inSelection && !this.drawingService.isPreviewCanvasBlank() && this.controlPointName === ControlPointName.none) {
                // paste image
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                const selectRectAc = new SelectionRectAction(this, this.drawingService, this.selection);
                this.undoRedoService.addUndo(selectRectAc);
                this.undoRedoService.clearRedo();
                this.pasteSelection(this.selection);
                this.mouseMovement = { x: 0, y: 0 };
                this.isAllSelect = false;
                this.selection.endingPos = this.mouseDownCoords;
                this.selection.imagePosition = this.mouseDownCoords;
            }
        }
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
            const selectRectAc = new SelectionRectAction(this, this.drawingService, this.selection);
            this.undoRedoService.addUndo(selectRectAc);
            this.undoRedoService.clearRedo();
            // paste image
            this.pasteSelection(this.selection);
            this.mouseMovement = { x: 0, y: 0 };
            this.isAllSelect = false;
            this.selection.endingPos = this.selection.imagePosition = this.mouseDownCoords;

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

    protected updateSelectionPositions(): Vec2 {
        const xSign = Math.sign(this.selection.endingPos.x - this.selection.imagePosition.x);
        const ySign = Math.sign(this.selection.endingPos.y - this.selection.imagePosition.y);
        const tmpEndPos = this.selection.endingPos;

        this.selection.width = Math.abs(this.selection.width);
        this.selection.height = Math.abs(this.selection.height);

        if (this.shiftPressed) {
            if (xSign > 0 && ySign > 0) {
                this.selection.endingPos = {
                    x: this.selection.imagePosition.x + this.selection.width,
                    y: this.selection.imagePosition.y + this.selection.height,
                };
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            }
            if (xSign > 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x + this.selection.width, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y - this.selection.height };
            }
            if (xSign < 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x - this.selection.width, y: this.selection.imagePosition.y - this.selection.height };
            } else {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y + this.selection.height };
                return { x: this.selection.imagePosition.x - this.selection.width, y: this.selection.imagePosition.y };
            }
        } else {
            if (xSign > 0 && ySign > 0) {
                return { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
            }
            if (xSign > 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.endingPos.x, y: this.selection.imagePosition.y };
                return { x: this.selection.imagePosition.x, y: tmpEndPos.y };
            } else if (xSign < 0 && ySign < 0) {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.imagePosition.y };
                return { x: tmpEndPos.x, y: tmpEndPos.y };
            } else {
                this.selection.endingPos = { x: this.selection.imagePosition.x, y: this.selection.endingPos.y };
                return { x: tmpEndPos.x, y: this.selection.imagePosition.y };
            }
        }
    }

    drawSelection(imagePosition: Vec2): void {
        if (this.scaled) {
            this.flipImage();
            this.scaled = false;
        }
        this.drawingService.previewCtx.save();
        // rotation
        this.rotationService.rotateSelection(this.selection, this.drawingService.previewCtx);
        this.drawingService.previewCtx.drawImage(this.selection.image, imagePosition.x, imagePosition.y, this.selection.width, this.selection.height);
        this.drawingService.previewCtx.restore();
        this.drawSelectionRect(imagePosition, this.selection.width, this.selection.height);
    }

    pasteSelection(selection: SelectionImage): void {
        this.drawingService.baseCtx.save();
        this.rotationService.rotateSelection(selection, this.drawingService.baseCtx);
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

    protected drawPreview(): void {
        this.drawPreviewRect(this.drawingService.previewCtx, this.shiftPressed);
    }

    clearSelection(): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(
            this.selection.copyImageInitialPos.x,
            this.selection.copyImageInitialPos.y,
            this.selection.width,
            this.selection.height,
        );
    }
}
