import { Injectable } from '@angular/core';
import { PIXEL_MOVEMENT } from '@app/classes/arrow-info';
import { ControlGroup } from '@app/classes/control-group';
import { ControlPoint, ControlPointName, CONTROLPOINT_SIZESIZE } from '@app/classes/control-points';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

export interface MagnetismParams {
    imagePosition: Vec2;
    endingPosition: Vec2;
    controlGroup: ControlGroup;
    selectionSize: Vec2;
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isMagnetismActive: boolean = false;

    // the following 2 variables are for locking mouseMovement
    private isMouseMagnetValueSet: boolean = false;
    private adjustedPosition: Vec2 = { x: -1, y: -1 };

    private prevControlPointName: ControlPointName = ControlPointName.none;
    private isFirstTimeArrow: boolean = true;

    constructor(private gridService: GridService) {}

    // we need to bring it back for image position compatible
    private convertCalculatingPosition(adjustedPosition: Vec2, controlPointName: ControlPointName, selectionSize: Vec2): Vec2 {
        switch (controlPointName) {
            case ControlPointName.center:
                return {
                    x: adjustedPosition.x - selectionSize.x / 2,
                    y: adjustedPosition.y - selectionSize.y / 2,
                };
            case ControlPointName.topLeft:
                return adjustedPosition;
            case ControlPointName.top:
                return {
                    x: adjustedPosition.x - selectionSize.x / 2,
                    y: adjustedPosition.y,
                };
            case ControlPointName.topRight:
                return {
                    x: adjustedPosition.x - selectionSize.x,
                    y: adjustedPosition.y,
                };
            case ControlPointName.left:
                return {
                    x: adjustedPosition.x,
                    y: adjustedPosition.y - selectionSize.y / 2,
                };
            case ControlPointName.right:
                return {
                    x: adjustedPosition.x - selectionSize.x,
                    y: adjustedPosition.y - selectionSize.y / 2,
                };
            case ControlPointName.bottomLeft:
                return {
                    x: adjustedPosition.x - selectionSize.x,
                    y: adjustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottom:
                return {
                    x: adjustedPosition.x - selectionSize.x / 2,
                    y: adjustedPosition.y - selectionSize.y,
                };
            case ControlPointName.bottomRight:
                return {
                    x: adjustedPosition.x,
                    y: adjustedPosition.y - selectionSize.y,
                };
            case ControlPointName.none:
        }
        return {} as Vec2;
    }

    // the following methods calculate where to adjust the xy position
    private calculateRemainder(squareWidth: number, calculatingPosition: Vec2): void {
        const remainderX = calculatingPosition.x % squareWidth;
        if (remainderX <= squareWidth / 2) this.adjustedPosition.x = calculatingPosition.x - remainderX;
        else this.adjustedPosition.x = calculatingPosition.x - remainderX + squareWidth;

        const remainderY = calculatingPosition.y % squareWidth;
        if (remainderY <= squareWidth / 2) this.adjustedPosition.y = calculatingPosition.y - remainderY;
        else this.adjustedPosition.y = calculatingPosition.y - remainderY + squareWidth;
    }

    private applyFinalPosition(params: MagnetismParams): void {
        params.endingPosition.x = this.adjustedPosition.x + params.selectionSize.x;
        params.endingPosition.y = this.adjustedPosition.y + params.selectionSize.y;

        params.imagePosition.x = this.adjustedPosition.x;
        params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;
    }

    applyMagnetismMouseMove(params: MagnetismParams): MagnetismParams {
        if (this.isMagnetismActive) {
            const squareWidth = this.gridService.squareWidth;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;

            if (!this.isMouseMagnetValueSet) {
                this.isMouseMagnetValueSet = true;

                const calculatingPosition = controlPoint.position;

                this.calculateRemainder(squareWidth, calculatingPosition);

                this.adjustedPosition = this.convertCalculatingPosition(
                    this.adjustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );
            }

            this.applyFinalPosition(params);

            params.controlGroup.setPositions(params.imagePosition, params.endingPosition, params.selectionSize);
            return {
                imagePosition: params.imagePosition,
                endingPosition: params.endingPosition,
                controlGroup: params.controlGroup,
            } as MagnetismParams;
        }
        return { imagePosition: params.imagePosition, endingPosition: params.endingPosition, controlGroup: params.controlGroup } as MagnetismParams;
    }

    applyMagnetismArrowKey(params: MagnetismParams, arrowDirection: Vec2): MagnetismParams {
        if (this.isMagnetismActive) {
            const squareWidth = this.gridService.squareWidth;
            const controlPoint = params.controlGroup.controlPoints.get(params.controlGroup.controlPointName) as ControlPoint;
            const controlPointName = params.controlGroup.controlPointName;

            const isTheSameControlPointName = controlPointName === this.prevControlPointName;
            if (!isTheSameControlPointName) {
                this.prevControlPointName = controlPointName;
                this.isFirstTimeArrow = true;
            }

            if (this.isFirstTimeArrow) {
                this.isFirstTimeArrow = false;

                const calculatingPosition = controlPoint.position;

                this.calculateRemainder(squareWidth, calculatingPosition);

                this.adjustedPosition = this.convertCalculatingPosition(
                    this.adjustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );

                this.applyFinalPosition(params);
            } else {
                const calculatingPosition = controlPoint.position;

                this.adjustedPosition.x = calculatingPosition.x + (arrowDirection.x / PIXEL_MOVEMENT) * squareWidth + CONTROLPOINT_SIZESIZE / 2;
                this.adjustedPosition.y = calculatingPosition.y + (arrowDirection.y / PIXEL_MOVEMENT) * squareWidth + CONTROLPOINT_SIZESIZE / 2;

                this.adjustedPosition = this.convertCalculatingPosition(
                    this.adjustedPosition,
                    params.controlGroup.controlPointName,
                    params.selectionSize,
                );

                params.endingPosition.x = this.adjustedPosition.x + params.selectionSize.x;
                params.endingPosition.y = this.adjustedPosition.y + params.selectionSize.y;

                params.imagePosition.x = this.adjustedPosition.x;
                params.imagePosition.y = params.endingPosition.y - params.selectionSize.y;
            }

            params.controlGroup.setPositions(params.imagePosition, params.endingPosition, params.selectionSize);
            return {
                imagePosition: params.imagePosition,
                endingPosition: params.endingPosition,
                controlGroup: params.controlGroup,
            } as MagnetismParams;
        }
        return { imagePosition: params.imagePosition, endingPosition: params.endingPosition, controlGroup: params.controlGroup } as MagnetismParams;
    }

    resetMagnetism(): void {
        this.prevControlPointName = ControlPointName.none;
        this.isMouseMagnetValueSet = false;
        this.isFirstTimeArrow = true;
        this.adjustedPosition = { x: -1, y: -1 };
    }
}
