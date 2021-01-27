import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SprayService } from '@app/services/tools/spray.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('SprayService', () => {
    let sprayService: SprayService;
    let baseStubCtx: CanvasRenderingContext2D;
    let colorServiceMock: jasmine.SpyObj<ColorService>;
    let drawingServiceMock: jasmine.SpyObj<DrawingService>;
    let transformSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        colorServiceMock = jasmine.createSpyObj('ColorService', ['numeralToHex', 'getColor']);
        drawingServiceMock = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx']);
        baseStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorServiceMock },
                { provide: DrawingService, useValue: drawingServiceMock },
            ],
        });
        sprayService = TestBed.inject(SprayService);
        colorServiceMock = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
        drawingServiceMock = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingServiceMock.baseCtx = baseStubCtx;
        transformSpy = spyOn<any>(sprayService, 'transform').and.stub();
    });

    it('should be created', () => {
        expect(sprayService).toBeTruthy();
    });

    it('should generate random number', () => {
        const numberGenerated = sprayService.generateRandomValue(0, 3);
        expect(numberGenerated).toBeLessThanOrEqual(3);
    });

    it('should setTimeout and set mouseDown', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        sprayService.onMouseUp(event);
        expect(sprayService.mouseDown).toEqual(false);
    });

    it('should not call transform if mouseDown false ', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        sprayService.onMouseDown(event);
        expect(transformSpy).toHaveBeenCalled();
    });

    it('should update position on mouse move', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        sprayService.onMouseMove(event);
        expect(sprayService.position.x).toEqual(event.offsetX);
        expect(sprayService.position.y).toEqual(event.offsetY);
    });
});
