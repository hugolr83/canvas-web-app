import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismParams, MagnetismService } from '@app/services/tools/magnetism.service';
import { SelectionService } from '@app/services/tools/selection-service/selection-service';
import { Subscription, timer } from 'rxjs';
import { ControlGroup } from './control-group';
import { ControlPointName } from './control-points';
import { Vec2 } from './vec2';

export const PIXEL_MOVEMENT = 3;
export const MOVEMENT_DELAY = 100;
export const MIN_TIME_MOVEMENT = 500;
export class ArrowInfo {
    constructor(
        private direction: Vec2,
        private drawingService: DrawingService,
        private selectionService: SelectionService,
        private magnetismService: MagnetismService,
    ) {
        this.timerStarted = false;
        this.arrowPressed = false;
        this.selectionService = selectionService;
        this.direction = direction;
        this.drawingService = drawingService;
    }
    arrowPressed: boolean;
    subscription: Subscription;
    timerStarted: boolean;

    onArrowDown(controlGroup: ControlGroup): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            if (!this.selectionService.cleared) {
                this.selectionService.clearSelection();
                this.selectionService.cleared = true;
            }

            if (this.magnetismService.isMagnetismActive && controlGroup.controlPointName !== ControlPointName.none) {
                this.magnetismService.applyMagnetismArrowKey(
                    {
                        imagePosition: this.selectionService.selection.imagePosition,
                        endingPosition: this.selectionService.selection.endingPos,
                        controlGroup,
                        selectionSize: { x: this.selectionService.selection.width, y: this.selectionService.selection.height } as Vec2,
                    } as MagnetismParams,
                    this.direction,
                );

                this.arrowPressed = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.selectionService.drawSelection(this.selectionService.selection.imagePosition);
            } else {
                if (!this.arrowPressed) {
                    // first movement
                    this.selectionService.mouseMovement.x = this.direction.x;
                    this.selectionService.mouseMovement.y = this.direction.y;
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.selectionService.selection.imagePosition = {
                        x: this.selectionService.selection.imagePosition.x + this.selectionService.mouseMovement.x,
                        y: this.selectionService.selection.imagePosition.y + this.selectionService.mouseMovement.y,
                    };
                    this.selectionService.selection.endingPos = {
                        x: this.selectionService.selection.endingPos.x + this.selectionService.mouseMovement.x,
                        y: this.selectionService.selection.endingPos.y + this.selectionService.mouseMovement.y,
                    };
                    this.selectionService.drawSelection(this.selectionService.selection.imagePosition);
                }
                this.arrowPressed = true;
                this.selectionService.startTimer();
                // for continuous movement
                if (this.selectionService.time >= MIN_TIME_MOVEMENT) {
                    this.startMoveSelectionTimer();
                }
            }
        }
    }

    startMoveSelectionTimer(): void {
        if (!this.timerStarted) {
            this.timerStarted = true;
            const timerMove = timer(MOVEMENT_DELAY, MOVEMENT_DELAY);

            this.subscription = timerMove.subscribe(() => {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.selectionService.mouseMovement.x = this.direction.x;
                this.selectionService.mouseMovement.y = this.direction.y;
                this.selectionService.selection.imagePosition = {
                    x: this.selectionService.selection.imagePosition.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.selection.imagePosition.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.selection.endingPos = {
                    x: this.selectionService.selection.endingPos.x + this.selectionService.mouseMovement.x,
                    y: this.selectionService.selection.endingPos.y + this.selectionService.mouseMovement.y,
                };
                this.selectionService.drawSelection(this.selectionService.selection.imagePosition);
            });
        }
    }

    onArrowUp(): void {
        if (!this.drawingService.isPreviewCanvasBlank()) {
            this.arrowPressed = false;
            this.selectionService.resetTimer();
            if (this.timerStarted) {
                this.subscription.unsubscribe();
            }

            this.selectionService.mouseMovement = { x: 0, y: 0 };
            this.timerStarted = false;
        }
    }
}
