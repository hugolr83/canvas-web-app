import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolSelected } from '@app/classes/sub-tool-selected';
import { EllipseAction } from '@app/classes/undo-redo/ellipse-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizeService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { GridService } from '@app/services/tools/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('EllipseAction', () => {
    let ellipseActionStub: EllipseAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let ellipseStub: EllipseService;

    let mousePosition: Vec2;
    let mouseDownCord: Vec2;
    let primaryColor: string;
    let secondaryColor: string;
    let lineWidth: number;
    let shiftPressed: boolean;
    let selectSubTool: SubToolSelected;
    let autoSaveStub: AutomaticSaveService;
    let canvasSelected: boolean;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let canvasResizeStub: CanvasResizeService;
    let gridStub: GridService;
    beforeEach(() => {
        mousePosition = { x: 5, y: 6 };
        mouseDownCord = { x: 25, y: 15 };
        primaryColor = '#000000';
        secondaryColor = 'rgba(0,0,0,0)';
        lineWidth = 3;
        selectSubTool = SubToolSelected.tool1;
        shiftPressed = false;
        canvasSelected = false;
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        gridStub = new GridService(drawingStub);
        canvasResizeStub = new CanvasResizeService(gridStub, undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizeStub, drawingStub, undoRedoStub);
        ellipseStub = new EllipseService(drawingStub, colorStub, undoRedoStub, autoSaveStub);

        ellipseActionStub = new EllipseAction(
            mousePosition,
            mouseDownCord,
            primaryColor,
            secondaryColor,
            lineWidth,
            shiftPressed,
            selectSubTool,
            canvasSelected,
            ellipseStub,
            drawingStub,
        );

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
                { provide: EllipseService, useValue: ellipseStub },
                { provide: EllipseAction, useValue: ellipseActionStub },
                { provide: AutomaticSaveService, useValue: { save: () => '' } },
            ],
        });
        ellipseActionStub = TestBed.inject(EllipseAction);
        ellipseStub = TestBed.inject(EllipseService);
    });

    it('strokeColor and lineWidth must be equal to be primaryColor and thickness of an ellipseAction', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        ellipseActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(lineWidth);
    });

    it('should call selectEllipse', () => {
        const selectEllipseSpy = spyOn(ellipseStub, 'selectEllipse').and.stub();
        ellipseActionStub.apply();
        expect(selectEllipseSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(ellipseStub, 'clearEffectTool').and.stub();
        ellipseActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
