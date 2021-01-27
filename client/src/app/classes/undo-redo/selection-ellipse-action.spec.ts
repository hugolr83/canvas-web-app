import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionImage } from '@app/classes/selection';
import { SelectionEllipseAction } from '@app/classes/undo-redo/selection-ellipse-action';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RotationService } from '@app/services/tools/selection-service/rotation.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('SelectionEllipseAction', () => {
    let selectionEllipseActionStub: SelectionEllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let selectionEllipseStub: SelectionEllipseService;
    let magnetismStub: MagnetismService;
    let gridStub: GridService;
    let rotationStub: RotationService;
    let autoSave: AutomaticSaveService;
    let canvasResizeStub: CanvasResizeService;

    let selection: SelectionImage;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        selection = new SelectionImage(drawingStub);
        selection.image = new Image();
        selection.image.src = selection.image.src;
        selection.copyImageInitialPos = { x: selection.copyImageInitialPos.x, y: selection.copyImageInitialPos.y };
        selection.imagePosition = { x: selection.imagePosition.x, y: selection.imagePosition.y };
        selection.endingPos = { x: selection.endingPos.x, y: selection.endingPos.y };
        selection.imageSize = { x: selection.imageSize.x, y: selection.imageSize.y };
        selection.ellipseRadian = { x: selection.ellipseRadian.x, y: selection.ellipseRadian.y };
        selection.width = selection.width;
        selection.height = selection.height;
        selection.imageData = selection.imageData;
        selection.image = new Image();
        selection.image.src = selection.image.src;
        selection.rotationAngle = 2;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        gridStub = new GridService(drawingStub);
        magnetismStub = new MagnetismService(gridStub);
        rotationStub = new RotationService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSave = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        selectionEllipseStub = new SelectionEllipseService(drawingStub, magnetismStub, rotationStub, undoRedoStub, autoSave);

        selectionEllipseActionStub = new SelectionEllipseAction(selectionEllipseStub, drawingStub, selection);
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
                { provide: SelectionEllipseAction, useValue: selectionEllipseActionStub },
                { provide: SelectionEllipseService, useValue: selectionEllipseStub },
            ],
        });
        selectionEllipseActionStub = TestBed.inject(SelectionEllipseAction);
        selectionEllipseStub = TestBed.inject(SelectionEllipseService);
    });

    it('should call clearSelection', () => {
        const clearSelectionSpy = spyOn(selectionEllipseStub, 'clearSelection').and.stub();
        selectionEllipseActionStub.apply();
        expect(clearSelectionSpy).toHaveBeenCalled();
    });

    it('should call pasteSelection', () => {
        const pasteSelectionSpy = spyOn(selectionEllipseStub, 'pasteSelection').and.stub();
        selectionEllipseActionStub.apply();
        expect(pasteSelectionSpy).toHaveBeenCalled();
    });
});
