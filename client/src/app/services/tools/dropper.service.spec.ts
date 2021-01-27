import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DropperService } from '@app/services/tools/dropper.service';

// tslint:disable:no-magic-numbers

describe('DropperService', () => {
    let dropperService: DropperService;
    let colorServiceMock: jasmine.SpyObj<ColorService>;
    let dropperStubCtx: CanvasRenderingContext2D;
    let circleCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        const colorSpy = jasmine.createSpyObj('ColorService', ['numeralToHex', 'getColor']);
        const drawingSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx']);
        dropperStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        circleCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorSpy },
                { provide: DrawingService, useValue: drawingSpy },
            ],
        });
        dropperService = TestBed.inject(DropperService);
        colorServiceMock = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
        // tslint:disable:no-string-literal
        dropperService['drawingService'].cursorCtx = dropperStubCtx;
        dropperService.circleCtx = circleCtxStub;
    });

    it('should be created', () => {
        expect(dropperService).toBeTruthy();
    });

    it('should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Left } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.getColor).toHaveBeenCalled();
    });
    it('should should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Left } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.numeralToHex).toHaveBeenCalled();
    });

    it('should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Right } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.getColor).toHaveBeenCalled();
    });
    it('should should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Right } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.numeralToHex).toHaveBeenCalled();
    });
    it('should call getColor onMouseMove', () => {
        const mouseEvent = { offsetX: 15, offsetY: 6 } as MouseEvent;
        dropperService.onMouseMove(mouseEvent);
        expect(colorServiceMock.getColor).toHaveBeenCalled();
    });
    it('should call numeralToHex', () => {
        const mouseEvent = { offsetX: 15, offsetY: 6 } as MouseEvent;
        dropperService.onMouseMove(mouseEvent);
        expect(colorServiceMock.numeralToHex).toHaveBeenCalled();
    });

    it('should set display to none onMouseOut', () => {
        const mouseEvent = { offsetX: 15, offsetY: 6 } as MouseEvent;
        dropperService.onMouseOut(mouseEvent);
        expect(dropperStubCtx.canvas.style.display).toEqual('none');
        expect(dropperStubCtx.canvas.style.display).toEqual('none');
    });
    it('should set display to none onMouseOut', () => {
        const mouseEvent = { offsetX: 15, offsetY: 6 } as MouseEvent;
        dropperService.onMouseEnter(mouseEvent);
        expect(dropperStubCtx.canvas.style.display).toEqual('inline-block');
        expect(dropperStubCtx.canvas.style.display).toEqual('inline-block');
    });
});
