import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SprayAction } from '@app/classes/undo-redo/spray-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/tools/grid.service';
import { SprayService } from '@app/services/tools/spray.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('SprayAction', () => {
    let sprayActionStub: SprayAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let sprayStub: SprayService;
    let canvasResizeStub: CanvasResizeService;
    let autoSaveStub: AutomaticSaveService;
    let gridStub: GridService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let density: number;
    let color: string;
    let zoneDiameter: number;
    let dropDiameter: number;
    const angle: number[] = [];
    const radius: number[] = [];
    let position: Vec2;

    beforeEach(() => {
        color = '#000000';
        density = 2;
        zoneDiameter = 5;
        dropDiameter = 6;
        position = { x: 10, y: 5 };
        angle.push(3);
        length = 20;
        radius.push(4);

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        sprayStub = new SprayService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        sprayActionStub = new SprayAction(density, color, zoneDiameter, dropDiameter, angle, radius, position, drawingStub, sprayStub);

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
                { provide: SprayAction, useValue: sprayActionStub },
                { provide: SprayService, useValue: sprayStub },
            ],
        });
        sprayActionStub = TestBed.inject(SprayAction);
        sprayStub = TestBed.inject(SprayService);
    });

    it('fillStyle and lineJoin must be primary color and thickness of sprayAction', () => {
        drawingStub.baseCtx.fillStyle = drawingStub.previewCtx.fillStyle = '#000000';
        sprayActionStub.apply();
        expect(drawingStub.baseCtx.fillStyle).toEqual(color);
    });

    it('should call transform', () => {
        const transformSpy = spyOn(sprayStub, 'transform').and.stub();
        sprayActionStub.apply();
        expect(transformSpy).toHaveBeenCalled();
    });
});
