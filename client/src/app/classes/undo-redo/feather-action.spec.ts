import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { FeatherAction } from '@app/classes/undo-redo/feather-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FeatherService } from '@app/services/tools/feather.service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('FeatherAction', () => {
    let featherActionStub: FeatherAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let featherStub: FeatherService;
    let canvasResizeStub: CanvasResizeService;
    let autoSaveStub: AutomaticSaveService;
    let gridStub: GridService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    const changes: Vec2[] = [];
    let angle: number;
    let length: number;
    let primaryColor: string;

    beforeEach(() => {
        changes.push({ x: 5, y: 6 });
        changes.push({ x: 6, y: 7 });
        primaryColor = '#000000';
        // tslint:disable:no-magic-numbers
        angle = 3;
        // tslint:disable:no-magic-numbers
        length = 20;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        featherStub = new FeatherService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        featherActionStub = new FeatherAction(changes, angle, length, primaryColor, drawingStub, featherStub);

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
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
                { provide: FeatherAction, useValue: featherActionStub },
                { provide: FeatherService, useValue: featherStub },
            ],
        });
        featherActionStub = TestBed.inject(FeatherAction);
        featherStub = TestBed.inject(FeatherService);
    });

    it('strokeStyle and lineJoin must be primary color and thickness of featherAction', () => {
        drawingStub.baseCtx.strokeStyle = drawingStub.previewCtx.strokeStyle = '#000000';
        featherActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
    });

    it('should call drawFeather', () => {
        const drawFeatherSpy = spyOn(featherStub, 'drawFeather').and.stub();
        featherActionStub.apply();
        expect(drawFeatherSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(featherStub, 'clearEffectTool').and.stub();
        featherActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
