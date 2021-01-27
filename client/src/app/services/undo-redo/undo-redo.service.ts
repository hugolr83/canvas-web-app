import { Injectable } from '@angular/core';
import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
import { LoadAction } from '@app/classes/undo-redo/load-action';
import { ResizeCanvasAction } from '@app/classes/undo-redo/resize-canvas-action';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    isUndoDisabled: boolean = true;
    isRedoDisabled: boolean = true;
    defaultCanvasAction: ResizeCanvasAction; // will be instantiated when canvas is ngAfterViewInit
    isImageLoaded: boolean = false;
    private firstLoadedImage: LoadAction;
    private listUndo: AbsUndoRedo[] = [];
    private redoList: AbsUndoRedo[] = [];

    constructor(private drawingService: DrawingService) {}

    redo(): void {
        if (this.redoList.length > 0) {
            const action = this.redoList.pop();
            if (action) {
                this.listUndo.push(action);
                action.apply(); // applies the action
            }
        }
        this.updateStatus();
    }

    // allows to reset the listUndo after we redo something.
    clearUndo(): void {
        this.listUndo = [];
        this.isImageLoaded = false;
        this.updateStatus();
    }
    // allows to reset the redoList
    clearRedo(): void {
        this.redoList = [];
        this.updateStatus();
    }

    // adds the latest  action to the undo stack.
    addUndo(action: AbsUndoRedo): void {
        this.listUndo.push(action);
        this.updateStatus();
    }

    loadImage(action: LoadAction): void {
        this.firstLoadedImage = action;
        this.isImageLoaded = true;
    }

    async undo(): Promise<void> {
        const action = this.listUndo.pop(); // last modification is removed and pushed into the redo stack
        if (action) {
            this.redoList.push(action);
            const listOfResize: AbsUndoRedo[] = [];

            if (this.isImageLoaded) {
                await this.firstLoadedImage.apply();
            } else {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
            }
            // reapply the currents elements (without the removed one)
            for (const element of this.listUndo) {
                if (element instanceof ResizeCanvasAction) {
                    listOfResize.push(element);
                } else {
                    element.apply();
                }
            }

            if (listOfResize.length === 0 && !this.isImageLoaded) {
                this.defaultCanvasAction.apply();
            }
            if (listOfResize.length > 0) {
                listOfResize[listOfResize.length - 1].apply();
            }
        }
        this.updateStatus();
    }

    updateStatus(): void {
        this.isRedoDisabled = this.redoList.length === 0;
        this.isUndoDisabled = this.listUndo.length === 0;
    }

    whileDrawingUndoRedo(event: MouseEvent): void {
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    }

    activateUndo(event: MouseEvent): void {
        this.isUndoDisabled = false;
    }
}
