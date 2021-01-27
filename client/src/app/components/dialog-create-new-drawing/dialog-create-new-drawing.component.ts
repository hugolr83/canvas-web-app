import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-dialog-create-new-drawing',
    templateUrl: './dialog-create-new-drawing.component.html',
    styleUrls: ['./dialog-create-new-drawing.component.scss'],
})
export class DialogCreateNewDrawingComponent {
    private warningCounter: number = 0;
    message: string = 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?';

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: Data,
        private dialogRef: MatDialogRef<DialogCreateNewDrawingComponent>,
        private drawingService: DrawingService,
        private canvasResizeService: CanvasResizeService,
        private router: Router,
        private undoRedoService: UndoRedoService,
    ) {
        if (this.data) {
            this.message = data.message;
        }
    }

    @HostListener('window:keydown.enter', ['$event']) onEnter(event: KeyboardEvent): void {
        this.onConfirmClick();
    }

    onConfirmClick(): void {
        if (
            this.message === 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?' &&
            !this.drawingService.isCanvasBlank() &&
            this.warningCounter === 0
        ) {
            alert('⚠️⚠️⚠️EFFACER EST UNE OPÉRATION IRRÉVERSIBLE⚠️⚠️⚠️');
            ++this.warningCounter;
            return;
        }
        this.warningCounter = 0;
        this.canvasResizeService.canvasSize.x = this.canvasResizeService.DEFAULT_WIDTH;
        this.canvasResizeService.canvasSize.y = this.canvasResizeService.DEFAULT_HEIGHT;
        this.dialogRef.close(true);

        if (this.message === 'Êtes-vous sûr de vouloir effacer votre dessin actuel ?') {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.undoRedoService.clearRedo();
            this.undoRedoService.clearUndo();
        }
        this.router.navigate(['/editor']);
    }
}
