/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from './text.service';

// tslint:disable:no-unused-variable
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-consecutive-blank-lines
// tslint:disable:prettier
// tslint:disable:max-file-line-count
// tslint:disable:no-shadowed-variable

describe('Service: Text', () => {
    let textService: TextService;
    let mouseEvent0: MouseEvent;

    let automaticSaveServiceSpy: jasmine.SpyObj<AutomaticSaveService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        automaticSaveServiceSpy = jasmine.createSpyObj('AutomaticSaveService', ['save']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearEffectTool']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['getprimaryColor', 'getsecondaryColor']);
        TestBed.configureTestingModule({
            providers: [
                { provide: AutomaticSaveService, useValue: automaticSaveServiceSpy },
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        textService = TestBed.inject(TextService);
        // tslint:disable:no-string-literal
        textService['drawingService'].baseCtx = baseCtxStub;
        textService['drawingService'].previewCtx = previewCtxStub;
        textService['mouseDownCoords'] = { x: 100, y: 150 };
        textService['mousePosition'] = { x: 40, y: 55 };

        mouseEvent0 = {
            offsetX: 25,
            offsetY: 27,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', inject([TextService], (textService: TextService) => {
        expect(textService).toBeTruthy();
    }));

    // mouseEvent
    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        textService.onMouseDown(mouseEventRClick);
        expect(textService.mouseDown).toEqual(false);
    });

    it(' mouseDown should not call setCtxFont & drawText but call drawPreviewRect', () => {
        spyOn<any>(textService, 'setCtxFont');
        spyOn<any>(textService, 'drawPreviewRect');
        textService['writeOnPreviewCtx'] = false;
        textService['mouseEnter'] = true;
        textService['mouseOut'] = false;
        textService['mouseDown'] = true;
        textService.onMouseDown(mouseEvent0);
        expect(textService['drawPreviewRect']).toHaveBeenCalled();
        expect(textService['setCtxFont']).not.toHaveBeenCalled();
    });

    it(' mouseDown should call setCtxFont & drawText', () => {
        spyOn<any>(textService, 'setCtxFont');
        textService['writeOnPreviewCtx'] = true;
        textService.onMouseDown(mouseEvent0);
        expect(textService['setCtxFont']).toHaveBeenCalled();
    });

    it(' mouseUp should not call drawPreviewRect (1)', () => {
        spyOn<any>(textService, 'drawPreviewRect');
        textService['mouseDown'] = false;
        textService.onMouseUp(mouseEvent0);
        expect(textService['drawPreviewRect']).not.toHaveBeenCalled();
    });

    it(' mouseUp should call drawPreviewRect (2)', () => {
        spyOn<any>(textService, 'drawPreviewRect');
        textService['mouseDown'] = true;
        textService.onMouseUp(mouseEvent0);
        expect(textService['drawPreviewRect']).toHaveBeenCalled();
    });

    it(' mouseMove should not call drawPreviewRect (1)', () => {
        spyOn<any>(textService, 'drawPreviewRect');
        textService['mouseMove'] = false;
        textService.onMouseMove(mouseEvent0);
        expect(textService['drawPreviewRect']).not.toHaveBeenCalled();
    });

    it(' mouseMove should call drawPreviewRect (2)', () => {
        spyOn<any>(textService, 'drawPreviewRect');
        textService['mouseMove'] = true;
        textService['mouseEnter'] = true;
        textService['mouseOut'] = false;
        textService['mouseDown'] = true;
        textService.onMouseMove(mouseEvent0);
        expect(textService['drawPreviewRect']).toHaveBeenCalled();
    });

    it(' should change mouseOut value to true when the mouse is living the canvas while left click is pressed', () => {
        textService.mouseDown = true;
        textService.onMouseOut(mouseEvent0);
        expect(textService['mouseOut']).toEqual(true);
    });

    it(' should not change mouseOut value to true when the mouse is living the canvas while left click is not pressed', () => {
        textService.mouseDown = false;
        textService.onMouseOut(mouseEvent0);
        expect(textService['mouseOut']).toEqual(false);
    });

    it(' should change mouseEnter value to true when the mouse is entering the canvas after leaving it while drawing', () => {
        textService['mouseOut'] = true;
        textService.onMouseEnter(mouseEvent0);
        expect(textService['mouseEnter']).toEqual(true);
    });

    // getters
    it(' should return italic if text is in italic', () => {
        textService.setItalic(true);
        spyOn<any>(textService, 'getItalic').and.callThrough();
        expect(textService['getItalic']()).toEqual('italic ');
    });

    it(' should not return italic if text is not in italic', () => {
        textService.setItalic(false);
        spyOn<any>(textService, 'getItalic').and.callThrough();
        expect(textService['getItalic']()).toEqual('');
    });

    it(' should return bold if text is in bold', () => {
        textService.setBold(true);
        spyOn<any>(textService, 'getBold').and.callThrough();
        expect(textService['getBold']()).toEqual('bold ');
    });
    it(' should return bold if text is in ', () => {
        textService.setBold(false);
        spyOn<any>(textService, 'getBold').and.callThrough();
        expect(textService['getBold']()).toEqual('');
    });

    // setters
    it(' should setItalic false if text is in italic ', () => {
        textService.setItalic(false);
        expect(textService['fontStyleItalic']).toEqual(false);
    });

    it(' should setItalic true if text is in italic ', () => {
        textService.setItalic(true);
        const styleItalic = textService['fontStyleItalic'];
        expect(styleItalic).toEqual(true);
    });
    it(' should setBold true if text is in bold', () => {
        textService.setBold(true);
        expect(textService['fontStyleBold']).toEqual(true);
    });
    it(' should setBold false if text is in bold', () => {
        textService.setBold(false);
        expect(textService['fontStyleBold']).toEqual(false);
    });

    it(' should setCtxFont', () => {
        const font = '18px Calibri';
        previewCtxStub.font = font;
        spyOn<any>(textService, 'setCtxFont').and.callThrough();
        textService['setCtxFont'](previewCtxStub);
        expect(previewCtxStub.font).toEqual('20px "Times New Roman"');
    });

    it(' should setCtxFont', () => {
        const font = '20px "Times New Roman"';
        previewCtxStub.font = font;
        spyOn<any>(textService, 'setCtxFont').and.callThrough();
        textService.fontStyle = 'Calibri';
        textService.setItalic(true);
        textService.setBold(true);
        textService.sizeFont = 8;
        textService['setCtxFont'](previewCtxStub);
        expect(previewCtxStub.font).toEqual('italic bold 8px Calibri');
    });

    // -------------------------------------------------------------------

    it('selectTextPosition to center', () => {
        previewCtxStub.textAlign = 'left';
        textService.selectTextPosition(1);
        expect(previewCtxStub.textAlign).toEqual('center');
    });

    it('selectTextPosition to left', () => {
        previewCtxStub.textAlign = 'center';
        textService.selectTextPosition(2);
        expect(previewCtxStub.textAlign).toEqual('left');
    });

    it('selectTextPosition to right', () => {
        previewCtxStub.textAlign = 'left';
        textService.selectTextPosition(3);
        expect(previewCtxStub.textAlign).toEqual('right');
    });

    it(' should return true if are writing some text', () => {
        textService['writeOnPreviewCtx'] = true;
        expect(textService.isOnPreviewCanvas()).toEqual(true);
    });

    it(' xTop should return mouseDownCoords + width', () => {
        spyOn<any>(textService, 'xTop').and.callThrough();
        const width = 150;
        const mouseDownCoords: Vec2 = { x: 0, y: 0 };
        const mousePos: Vec2 = { x: 50, y: 50 };
        const test = textService['xTop'](width, mouseDownCoords, mousePos);
        expect(test).toEqual(mouseDownCoords.x + width);
    });

    it(' xTop should return mousePosition + width', () => {
        spyOn<any>(textService, 'xTop').and.callThrough();
        const width = 150;
        const mouseDownCoords: Vec2 = { x: 100, y: 100 };
        const mousePos: Vec2 = { x: 50, y: 50 };
        const test = textService['xTop'](width, mouseDownCoords, mousePos);
        expect(test).toEqual(mousePos.x + width);
    });

    it(' yTop should return mouseDownCoords + width', () => {
        spyOn<any>(textService, 'yTop').and.callThrough();
        const sizeFont = 20;
        const mouseDownCoords: Vec2 = { x: 0, y: 0 };
        const mousePos: Vec2 = { x: 50, y: 50 };
        const test = textService['xTop'](sizeFont, mouseDownCoords, mousePos);
        expect(test).toEqual(mouseDownCoords.x + sizeFont);
    });

    it(' yTop should return mousePosition + width', () => {
        spyOn<any>(textService, 'yTop').and.callThrough();
        const sizeFont = 20;
        const mouseDownCoords: Vec2 = { x: 100, y: 100 };
        const mousePos: Vec2 = { x: 50, y: 50 };
        const test = textService['xTop'](sizeFont, mouseDownCoords, mousePos);
        expect(test).toEqual(mousePos.y + sizeFont);
    });

    // keyboard action
    it('arrowTop should call textPreview ', () => {
        textService['textControl']['textPreview'] = ['a', 'b', 'c'];
        textService['textControl']['indexLine'] = 3;
        textService.arrowTop();
        expect(textService['textControl']['indexLine']).toEqual(2);
    });

    it('arrowBottom should call textPreview ', () => {
        textService['textControl']['textPreview'] = ['a', 'b', 'c'];
        textService['textControl']['indexLine'] = 1;
        textService.arrowBottom();
        expect(textService['textControl']['indexLine']).toEqual(2);
    });

    it('arrowLeft should call textPreview ', () => {
        textService['textControl']['textLine'] = ['t', 'e'];
        textService['textControl']['textStack'] = ['s', 't'];
        textService['textControl']['indexOfLettersInLine'] = 2;
        textService.arrowLeft();
        expect(textService['textControl']['indexOfLettersInLine']).toEqual(1);
        expect(textService['textControl']['textLine']).toEqual(['t']);
    });

    it('arrowRight should call textPreview ', () => {
        textService['textControl']['textStack'] = ['t', 'e', 's', 't'];
        textService['textControl']['indexOfLettersInLine'] = 0;
        textService.arrowRight();
        expect(textService['textControl']['indexOfLettersInLine']).toEqual(1);
        expect(textService['textControl']['textLine']).toEqual(['t']);
    });

    it('backSpace should call textPreview ', () => {
        textService['textControl']['textLine'] = ['t', 'e', 's', 't'];
        textService['textControl']['indexOfLettersInLine'] = 4;
        textService.backspace();
        expect(textService['textControl']['indexOfLettersInLine']).toEqual(3);
        expect(textService['textControl']['textLine']).toEqual(['t', 'e', 's']);
    });

    it('delete should call textPreview ', () => {
        textService['textControl']['textLine'] = [' ', ' '];
        textService['textControl']['textStack'] = ['t', 'e', 's', 't'];
        textService['textControl']['indexOfLettersInLine'] = 2;
        textService.delete();
        expect(textService['textControl']['indexOfLettersInLine']).toEqual(2);
        expect(textService['textControl']['textStack']).toEqual(['t', 'e', 's']);
    });

    it('enter should call textPreview ', () => {
        textService['textControl']['textLine'] = ['t', 'e'];
        textService['textControl']['textStack'] = ['t', 's'];
        textService['textControl']['indexOfLettersInLine'] = 2;
        textService['textControl']['indexLine'] = 0;
        textService.enter();
        expect(textService['textControl']['indexLine']).toEqual(1);
        expect(textService['textControl']['textPreview']).toEqual(['te', '|st']);
    });

    it('clearEffectTool should call clearText', () => {
        textService['width'] = 200;
        textService['height'] = 250;
        textService.clearEffectTool();
        expect(textService['width']).toEqual(0);
        expect(textService['height']).toEqual(0);
    });

    it(' drawPreviewRect should draw a preview rectangle in the preview canvas (1)', () => {
        const mousePos = {
            offsetX: 10,
            offsetY: 15,
            button: 0,
        } as MouseEvent;
        const mouseDown = {
            offsetX: 20,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        textService['mouseEnter'] = true;
        textService.onMouseDown(mouseDown);
        textService.onMouseMove(mousePos);
        textService['drawPreviewRect'](previewCtxStub, textService['mouseDownCoords'], textService['mousePosition']);
        expect(textService['width']).toEqual(100);
        expect(textService['height']).toEqual(21);
    });

    it(' drawPreviewRect should draw a preview rectangle in the preview canvas (2)', () => {
        const mousePos = {
            offsetX: 128,
            offsetY: 109,
            button: 0,
        } as MouseEvent;
        const mouseDown = {
            offsetX: 539,
            offsetY: 317,
            button: 0,
        } as MouseEvent;
        textService['mouseEnter'] = true;
        textService.onMouseDown(mouseDown);
        textService.onMouseMove(mousePos);
        textService['drawPreviewRect'](previewCtxStub, textService['mouseDownCoords'], textService['mousePosition']);
        expect(textService['width']).toEqual(-411);
        expect(textService['height']).toEqual(-208);
    });

    it(' drawPreviewRect should draw a preview rectangle in the preview canvas (3)', () => {
        const mousePos = {
            offsetX: 554,
            offsetY: 119,
            button: 0,
        } as MouseEvent;
        const mouseDown = {
            offsetX: 264,
            offsetY: 256,
            button: 0,
        } as MouseEvent;
        textService['mouseEnter'] = true;
        textService.onMouseDown(mousePos);
        textService.onMouseMove(mouseDown);
        textService['drawPreviewRect'](previewCtxStub, textService['mouseDownCoords'], textService['mousePosition']);
        expect(textService['width']).toEqual(-290);
        expect(textService['height']).toEqual(137);
    });

    it(' drawPreviewRect should draw a preview rectangle in the preview canvas (4)', () => {
        const mousePos = {
            offsetX: 554,
            offsetY: 119,
            button: 0,
        } as MouseEvent;
        const mouseDown = {
            offsetX: 264,
            offsetY: 256,
            button: 0,
        } as MouseEvent;
        textService['mouseEnter'] = true;
        textService.onMouseDown(mouseDown);
        textService.onMouseMove(mousePos);
        textService['drawPreviewRect'](previewCtxStub, textService['mouseDownCoords'], textService['mousePosition']);
        expect(textService['width']).toEqual(290);
        expect(textService['height']).toEqual(-137);
    });

    it('keyUpHandler should not call addLetter & textPreview ', () => {
        textService['writeOnPreviewCtx'] = true;
        const keyEventData = { isTrusted: true, key: 'Delete' };
        const keyEvent = new KeyboardEvent('keydown', keyEventData);
        textService.keyUpHandler(keyEvent);
        expect(textService['textControl']['textLine']).toEqual([]);
    });
    it('keyUpHandler should call addLetter & textPreview "a"', () => {
        textService['writeOnPreviewCtx'] = true;
        const keyEventData = { isTrusted: true, key: 'a', which: 65, keyCode: 65, shiftLey: false };
        const keyEvent = new KeyboardEvent('keypress', keyEventData);
        textService.keyUpHandler(keyEvent);
        expect(textService['textControl'].getText()).toEqual(['a']);
    });
    it('keyUpHandler should call addLetter & textPreview "F2"', () => {
        textService['writeOnPreviewCtx'] = true;
        const keyEventData = { isTrusted: true, key: 'F2', which: 123, keyCode: 123, shiftLey: false };
        const keyEvent = new KeyboardEvent('keypress', keyEventData);
        textService.keyUpHandler(keyEvent);
        expect(textService['textControl'].getText()).toEqual(['']);
    });
});
