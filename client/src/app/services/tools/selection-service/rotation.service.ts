import { Injectable } from '@angular/core';
import { SelectionImage } from '@app/classes/selection';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection-service';

// tslint:disable:no-magic-numbers

const FIFTEEN = 15;
const ONE = 1;
export const TO_RADIAN = Math.PI / 180;

@Injectable({
    providedIn: 'root',
})
export class RotationService extends Tool {
    altPressed: boolean = false;
    isWheelAdd: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onWheelScroll(selectionService: SelectionService, event: WheelEvent): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.addOrRetract(event);
            selectionService.selection.rotationAngle = this.changeAngleWithScroll(selectionService.selection.rotationAngle);
            selectionService.clearSelection();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            selectionService.drawSelection(selectionService.selection.imagePosition);
        }
    }

    rotateSelection(selection: SelectionImage, ctx: CanvasRenderingContext2D): void {
        const angleInRadian = selection.rotationAngle * TO_RADIAN;
        ctx.translate(selection.imagePosition.x + selection.width / 2, selection.imagePosition.y + selection.height / 2);
        ctx.rotate(angleInRadian);
        ctx.translate(-selection.imagePosition.x - selection.width / 2, -selection.imagePosition.y - selection.height / 2);
    }

    changeAngleWithScroll(rotationAngle: number): number {
        if (this.isWheelAdd) {
            if (!this.altPressed) {
                return (rotationAngle += FIFTEEN);
            } else {
                return (rotationAngle += ONE);
            }
        } else {
            if (!this.altPressed) {
                return (rotationAngle -= FIFTEEN);
            } else {
                return (rotationAngle -= ONE);
            }
        }
    }

    addOrRetract(event: WheelEvent): void {
        // scroll up => wheel adds to the angle (same as when scrolling up a page.)
        // if the value of deltaY is < 0 that means we are scrolling up
        if (event.deltaY < 0) {
            this.isWheelAdd = true;
        } else {
            this.isWheelAdd = false;
        }
    }
}
