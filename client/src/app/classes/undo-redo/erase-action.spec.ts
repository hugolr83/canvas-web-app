import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { EraseAction } from '@app/classes/undo-redo/erase-actions';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:prefer-const
// tslint:disable:no-magic-numbers
describe('EraseAction', () => {
    let eraseActionStub: EraseAction;
    let drawingStub: DrawingService;
    let undoRedoStub: UndoRedoService;
    let eraserStub: EraserService;

    let changesEraser: Vec2[] = [];
    let color: string;
    let thickness: number;
    let autoSaveStub: AutomaticSaveService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let gridStub: GridService;
    let canvasResizeStub: CanvasResizeService;
    beforeEach(() => {
        changesEraser.push({ x: 5, y: 6 });
        changesEraser.push({ x: 25, y: 15 });
        color = '#000000';
        thickness = 5;

        drawingStub = new DrawingService();
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        eraserStub = new EraserService(drawingStub, undoRedoStub, autoSaveStub);

        eraseActionStub = new EraseAction(changesEraser, color, thickness, eraserStub, drawingStub);

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
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: EraseAction, useValue: eraseActionStub },
            ],
        });
        eraseActionStub = TestBed.inject(EraseAction);
        eraserStub = TestBed.inject(EraserService);
    });

    it('strokeColor and linewidth must be equal to primaryColor and thickness of an eraserAction', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        eraseActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(color);
        expect(drawingStub.baseCtx.lineWidth).toEqual(thickness);
    });

    it('should call removeLine', () => {
        const removeLineSpy = spyOn(eraserStub, 'removeLine').and.stub();
        eraseActionStub.apply();
        expect(removeLineSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(eraserStub, 'clearEffectTool').and.stub();
        eraseActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
