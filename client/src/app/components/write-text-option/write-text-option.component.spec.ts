import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextService } from '@app/services/tools/text.service';
import { WriteTextOptionComponent } from './write-text-option.component';

// tslint:disable:no-magic-numbers
// tslint:disable:no-unused-expression
// tslint:disable:no-string-literal
// tslint:disable:no-empty

describe('WriteTextOptionComponent', () => {
    let component: WriteTextOptionComponent;
    let fixture: ComponentFixture<WriteTextOptionComponent>;
    const event = new KeyboardEvent('window:keydown.control.a', {});
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                MatIconModule,
                MatGridListModule,
                MatFormFieldModule,
                MatOptionModule,
                MatSliderModule,
                MatSelectModule,
                FormsModule,
                MatLineModule,
                MatButtonToggleModule,
                BrowserAnimationsModule,
            ],
            declarations: [WriteTextOptionComponent],
            providers: [
                {
                    provide: TextService,
                    useValue: {
                        possibleSizeFont: [20, 22, 24, 26, 28, 30, 23, 34, 36, 38, 40, 48, 60, 72],
                        fontStyleBold: false,
                        fontStyleItalic: false,
                        selectTextPosition: () => '',
                        setBold: () => '',
                        setItalic: () => '',
                        keyUpHandler: () => '',
                        arrowLeft: () => '',
                        arrowRight: () => '',
                        enter: () => '',
                        clearEffectTool: () => '',
                        delete: () => '',
                        backspace: () => '',
                        arrowTop: () => '',
                        arrowBottom: () => '',
                        isOnPreviewCanvas: () => true,
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WriteTextOptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should ngOnInit', () => {
        expect(component['itBold']).toEqual(false);
        expect(component['itItalic']).toEqual(false);
    });
    it('should pick bold', () => {
        component.pickBold();
        expect(component['itBold']).toEqual(true);
        component.pickBold();
        expect(component['itBold']).toEqual(false);
    });
    it('should pick italic', () => {
        component.pickItalic();
        expect(component['itItalic']).toEqual(true);
        component.pickItalic();
        expect(component['itItalic']).toEqual(false);
    });

    it('should pickFontStyle', () => {
        spyOn(component['textService'], 'selectTextPosition');
        component.pickFontStyle(0);
        expect(component['textService']['selectTextPosition']).toHaveBeenCalled();
    });

    it('should keyUpHandler isOnPreviewCanvas is true', () => {
        spyOn(component['textService'], 'keyUpHandler');
        component.keyUpHandler(event);
        expect(component['textService']['keyUpHandler']).toHaveBeenCalled();
    });
    it('should keyUpHandler isOnPreviewCanvas is false', () => {
        spyOn(component['textService'], 'isOnPreviewCanvas').and.returnValue(false);
        spyOn(component['textService'], 'keyUpHandler');
        component.keyUpHandler(event);
        expect(component['textService']['keyUpHandler']).toHaveBeenCalled();
    });
    it('should onLeftArrow', () => {
        spyOn(component['textService'], 'arrowLeft');
        component.onLeftArrow(event);
        expect(component['textService']['arrowLeft']).toHaveBeenCalled();
    });
    it('should onRightArrow', () => {
        spyOn(component['textService'], 'arrowRight');
        component.onRightArrow(event);
        expect(component['textService']['arrowRight']).toHaveBeenCalled();
    });
    it('should onEnter', () => {
        spyOn(component['textService'], 'enter');
        component.onEnter(event);
        expect(component['textService']['enter']).toHaveBeenCalled();
    });
    it('should onDelete', () => {
        spyOn(component['textService'], 'delete');
        component.onDelete(event);
        expect(component['textService']['delete']).toHaveBeenCalled();
    });
    it('should onBackSpace', () => {
        spyOn(component['textService'], 'backspace');
        component.onBackSpace(event);
        expect(component['textService']['backspace']).toHaveBeenCalled();
    });
    it('should onTopArrow', () => {
        spyOn(component['textService'], 'arrowTop');
        component.onTopArrow(event);
        expect(component['textService']['arrowTop']).toHaveBeenCalled();
    });
    it('should onBottomArrow', () => {
        spyOn(component['textService'], 'arrowBottom');
        component.onBottomArrow(event);
        expect(component['textService']['arrowBottom']).toHaveBeenCalled();
    });
    it('should onEscape', () => {
        spyOn(component['textService'], 'clearEffectTool');
        component.onEscape(event);
        expect(component['textService']['clearEffectTool']).toHaveBeenCalled();
    });
});
