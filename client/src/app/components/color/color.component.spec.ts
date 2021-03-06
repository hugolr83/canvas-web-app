import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MouseButton } from '@app/classes/mouse-button';
import { RGBA } from '@app/classes/rgba';
import { ColorComponent } from '@app/components/color/color.component';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('ColorComponent', () => {
    let component: ColorComponent;
    let fixture: ComponentFixture<ColorComponent>;

    let drawingStub: DrawingService;
    let colorStub: ColorService;

    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            colorStub = new ColorService(drawingStub);

            TestBed.configureTestingModule({
                declarations: [ColorComponent],
                imports: [
                    MatIconModule,
                    MatGridListModule,
                    MatDividerModule,
                    MatListModule,
                    MatButtonModule,
                    MatDialogModule,
                    MatInputModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                ],
                providers: [
                    { provide: MatDialog, useValue: {} },
                    { provide: DrawingService, useValue: drawingStub },
                    { provide: ColorService, useValue: colorStub },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(ColorComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }),
    );

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call drawMovingStopper if colorStopperPosition != NaN', () => {
        // tslint:disable-next-line: use-isnan
        const event = { offsetX: 3, offsetY: 4 } as MouseEvent;
        colorStub.colorStopperPosition = event;
        const drawMovStopSpy = spyOn(colorStub, 'drawMovingStopper').and.stub();
        const drawSquareSpy = spyOn(component, 'drawSquarePalette').and.callThrough();
        const drawHorizontalSpy = spyOn(component, 'drawHorizontalPalette').and.callThrough();
        const drawOpacitySpy = spyOn(component, 'drawOpacitySlider').and.callThrough();

        component.ngAfterViewInit();

        expect(drawMovStopSpy).toHaveBeenCalled();
        expect(drawSquareSpy).toHaveBeenCalled();
        expect(drawHorizontalSpy).toHaveBeenCalled();
        expect(drawOpacitySpy).toHaveBeenCalled();
    });

    it('should call drawSquarePalette drawHorizontalPalette drawOpacitySlider', () => {
        // tslint:disable-next-line: use-isnan
        const event = { offsetX: 3, offsetY: 4 } as MouseEvent;
        colorStub.alphaStopperPosition = event;
        const drawSquareSpy = spyOn(component, 'drawSquarePalette').and.callThrough();
        const drawHorizontalSpy = spyOn(component, 'drawHorizontalPalette').and.callThrough();
        const drawOpacitySpy = spyOn(component, 'drawOpacitySlider').and.callThrough();

        component.ngAfterViewInit();

        expect(drawSquareSpy).toHaveBeenCalled();
        expect(drawHorizontalSpy).toHaveBeenCalled();
        expect(drawOpacitySpy).toHaveBeenCalled();
    });

    it('should set isClicked to true', () => {
        component.primaryClick();
        expect(colorStub.isClicked).toBe(true);
    });

    it('should set secondaryColor to false', () => {
        component.secondaryClick();
        expect(colorStub.isClicked).toBe(false);
    });

    it('should call drawPalette for square', () => {
        const colorSpy = spyOn(colorStub, 'drawPalette').and.callThrough();
        component.drawSquarePalette();
        expect(colorSpy).toHaveBeenCalled();
    });

    it('should call drawPalette for horizontal', () => {
        const colorSpy = spyOn(colorStub, 'drawPalette').and.callThrough();
        component.drawHorizontalPalette();
        expect(colorSpy).toHaveBeenCalled();
    });

    it('should call drawPalette for Opacity', () => {
        const colorSpy = spyOn(colorStub, 'drawPalette').and.callThrough();
        component.drawOpacitySlider();
        expect(colorSpy).toHaveBeenCalled();
    });

    it('should set Color', () => {
        const getColorSpy = spyOn(colorStub, 'getColor').and.stub();
        const numToHexSpy = spyOn(colorStub, 'numeralToHex').and.stub();

        const event = { offsetX: 15, offsetY: 47 } as MouseEvent;

        component.onMouseOverSquare(event);

        expect(getColorSpy).toHaveBeenCalled();
        expect(numToHexSpy).toHaveBeenCalled();
    });

    it('should set primary color and should add as last color', () => {
        const event = { x: 15, y: 38 } as MouseEvent;
        colorStub.isClicked = true;
        const addLastSpy = spyOn(colorStub, 'addLastColor').and.callThrough();
        component.onMouseOverSquareClick(event);

        expect(colorStub.primaryColor).toEqual(colorStub.previewColor);
        expect(addLastSpy).toHaveBeenCalled();
    });

    it('should set secondary color and should add as last color', () => {
        const event = { x: 15, y: 38 } as MouseEvent;
        colorStub.isClicked = false;
        const addLastSpy = spyOn(colorStub, 'addLastColor').and.callThrough();
        component.onMouseOverSquareClick(event);

        expect(colorStub.secondaryColor).toEqual(colorStub.previewColor);
        expect(addLastSpy).toHaveBeenCalled();
    });

    it('should set primary color add as last color set selected color set colorstopper position should call drawmoving stopper', () => {
        const event = { x: 15, y: 38 } as MouseEvent;
        colorStub.isClicked = true;
        const addLastSpy = spyOn(colorStub, 'addLastColor').and.callThrough();
        const movStopper = spyOn(colorStub, 'drawMovingStopper').and.callThrough();

        component.onMouseOverHorizontalClick(event);

        expect(colorStub.primaryColor).toEqual(colorStub.previewColor);
        expect(addLastSpy).toHaveBeenCalled();
        expect(colorStub.selectedColor).toEqual(colorStub.previewColor);
        expect(colorStub.colorStopperPosition).toEqual(event);
        expect(movStopper).toHaveBeenCalled();
    });

    it('should set secondary color add as last color set selected color set colorstopper position should call drawmoving stopper', () => {
        const event = { x: 15, y: 38 } as MouseEvent;
        colorStub.isClicked = false;
        const addLastSpy = spyOn(colorStub, 'addLastColor').and.callThrough();
        const movStopper = spyOn(colorStub, 'drawMovingStopper').and.callThrough();

        component.onMouseOverHorizontalClick(event);

        expect(colorStub.secondaryColor).toEqual(colorStub.previewColor);
        expect(addLastSpy).toHaveBeenCalled();
        expect(colorStub.selectedColor).toEqual(colorStub.previewColor);
        expect(colorStub.colorStopperPosition).toEqual(event);
        expect(movStopper).toHaveBeenCalled();
    });

    it('should set previewColor onMouseOverHorizontal', () => {
        const getColorSpy = spyOn(colorStub, 'getColor').and.stub();
        const numToHexSpy = spyOn(colorStub, 'numeralToHex').and.stub();

        const event = { offsetX: 15, offsetY: 47 } as MouseEvent;

        component.onMouseOverHorizontal(event);

        expect(getColorSpy).toHaveBeenCalled();
        expect(numToHexSpy).toHaveBeenCalled();
    });

    it('should set alphaStopper should call draw moving stopper should call change coloropacity', () => {
        const drawOpSliderSpy = spyOn(component, 'drawOpacitySlider').and.callThrough();
        const drawMovStopSpy = spyOn(colorStub, 'drawMovingStopper').and.stub();
        const posSliderSpy = spyOn(component, 'findPositionSlider').and.callThrough();
        const colorOpacitySpy = spyOn(colorStub, 'changeColorOpacity').and.stub();

        const event = { offsetX: 15, offsetY: 47, button: MouseButton.Left } as MouseEvent;

        component.onMouseOverOpacitySliderClick(event);

        expect(drawOpSliderSpy).toHaveBeenCalled();
        expect(drawMovStopSpy).toHaveBeenCalled();
        expect(posSliderSpy).toHaveBeenCalled();
        expect(colorOpacitySpy).toHaveBeenCalled();
    });

    it('should set primary color', () => {
        const event = { x: 15, y: 38, button: MouseButton.Left } as MouseEvent;
        const lastColor = { color: 'white' as string, active: true };

        component.onMouseLastColorClick(event, lastColor);

        expect(colorStub.primaryColor).toEqual(lastColor.color);
    });

    it('should set secondary color', () => {
        const event = { x: 15, y: 38, button: MouseButton.Right } as MouseEvent;
        const lastColor = { color: 'white' as string, active: true };

        component.onMouseLastColorClick(event, lastColor);

        expect(colorStub.secondaryColor).toEqual(lastColor.color);
    });

    it('should call change color opacity', () => {
        const rgba = { alpha: 1 } as RGBA;
        const spyColorOpacity = spyOn(colorStub, 'changeColorOpacity').and.stub();

        component.sendInput(rgba);

        expect(spyColorOpacity).toHaveBeenCalled();
    });

    it('should call change numeralToHex and changeColorOpacity', () => {
        const rgba = { red: 255, green: 0, blue: 0, alpha: 1 } as RGBA;
        const numToHexSpy = spyOn(colorStub, 'numeralToHex').and.stub();
        const colorOpacitySpy = spyOn(colorStub, 'changeColorOpacity').and.stub();

        component.sendInput(rgba);

        expect(numToHexSpy).toHaveBeenCalled();
        expect(colorOpacitySpy).toHaveBeenCalled();
    });

    it('should open warning message', () => {
        const rgba = { red: 256, green: 0, blue: 0, alpha: 1 } as RGBA;
        const matDialogRef = jasmine.createSpyObj('matDialogRef', ['close']);
        component.errorMsg = jasmine.createSpyObj('MatDialog', ['open']);
        component.errorMsg.open = jasmine.createSpy().and.callFake(() => {
            return matDialogRef;
        });

        component.sendInput(rgba);
        expect(component.message).toEqual(matDialogRef);
    });
});
