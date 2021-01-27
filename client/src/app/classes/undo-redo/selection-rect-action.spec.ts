import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionImage } from '@app/classes/selection';
import { SelectionRectAction } from '@app/classes/undo-redo/selection-rect-action';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers
describe('SelectionRectAction', () => {
    let selectionRectActionStub: SelectionRectAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionRectStub: SelectionRectangleService;
    let magnetismStub: MagnetismService;
    let gridStub: GridService;
    let rotationStub: RotationService;
    let canvasResizeStub: CanvasResizeService;

    let selection: SelectionImage;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let autoSave: AutomaticSaveService;

    beforeEach(() => {
        selection = new SelectionImage(drawingStub);
        selection.image = new Image();
        selection.image.src = selection.image.src;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        magnetismStub = new MagnetismService(gridStub);
        gridStub = new GridService(drawingStub);
        rotationStub = new RotationService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSave = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        selectionRectStub = new SelectionRectangleService(drawingStub, magnetismStub, rotationStub, undoRedoStub, autoSave);
        selectionRectActionStub = new SelectionRectAction(selectionRectStub, drawingStub, selection);
        canvas = canvasTestHelper.canvas;
        canvas.width = 100;
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: SelectionRectAction, useValue: selectionRectActionStub },
                { provide: SelectionRectangleService, useValue: selectionRectStub },
            ],
        });
        selectionRectActionStub = TestBed.inject(SelectionRectAction);
        selectionRectStub = TestBed.inject(SelectionRectangleService);
    });

    it('should call clearSelection', () => {
        const clearSelectionSpy = spyOn(selectionRectStub, 'clearSelection').and.stub();
        selectionRectActionStub.apply();
        expect(clearSelectionSpy).toHaveBeenCalled();
    });
});
