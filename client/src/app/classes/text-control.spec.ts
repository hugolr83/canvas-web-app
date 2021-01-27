import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextControl } from './text-control';

// magic numbers needed for testing
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:no-string-literal
// test file are often longer than 350 lines
// tslint:disable:max-file-line-count
// tslint:disable:prefer-for-of

describe('TextControl', () => {
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let textControl: TextControl;
    let previewCanvas: HTMLCanvasElement;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvas = document.createElement('canvas');
        previewCanvas.width = 100;
        previewCanvas.height = 100;
        previewCtxStub = previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        textControl = new TextControl(previewCtxStub);
    });
    it('should create an instance two ', () => {
        textControl = new TextControl(previewCtxStub, 50);
        expect(new TextControl(previewCtxStub, 50)).toBeTruthy();
        expect(textControl['width']).toEqual(50);
    });
    it('should create an instance', () => {
        expect(new TextControl(previewCtxStub)).toBeTruthy();
    });

    it('should setWidth 50', () => {
        textControl.setWidth(50);
        expect(textControl['width']).toEqual(50);
    });

    it('should setCtx previewCtx', () => {
        textControl.setCtx(baseCtxStub);
        expect(textControl['ctx']).toEqual(baseCtxStub);
    });

    it('getFont should return Times New Roman', () => {
        const font = '20px "Times New Roman"';
        baseCtxStub.font = font;
        textControl.setCtx(baseCtxStub);
        expect(textControl.getFont()).toEqual(font);
    });

    it('getText should addLetter ', () => {
        textControl['nbOfLettersInLine'] = 50;
        const text = 'test2';
        textControl.addLetter(text);
        expect(textControl['textLine'][0]).toEqual('t');
        expect(textControl['textLine'][1]).toEqual('e');
        expect(textControl['textLine'][2]).toEqual('s');
        expect(textControl['textLine'][3]).toEqual('t');
        expect(textControl['textLine'][4]).toEqual('2');
    });

    it('getText should addLetter a', () => {
        textControl['nbOfLettersInLine'] = 50;
        const text = 't';
        textControl.addLetter(text);
        expect(textControl['textLine']).toEqual([text]);
    });

    it('getTextWithCursor should return text', () => {
        textControl['nbOfLettersInLine'] = 50;
        const textTest = 'test';
        for (let index = 0; index < textTest.length; index++) {
            textControl.addLetter(textTest[index]);
        }
        expect(textControl['textLine']).toEqual(['t', 'e', 's', 't']);
    });

    it('checkWidthText should return false if text size < width ', () => {
        const textOnCanvas = 'test';
        const width = 10;
        expect(textControl.checkWidthText(baseCtxStub, textOnCanvas, width)).toEqual(false);
    });

    it('checkWidthText should return true if text size < width ', () => {
        const textOnCanvas = 'test';
        const width = 150;
        expect(textControl.checkWidthText(baseCtxStub, textOnCanvas, width)).toEqual(true);
    });

    it('checkHeightText should return true', () => {
        const nbLine = 3;
        const sizeFont = 20;
        const height = 150;
        expect(textControl.checkHeightText(nbLine, sizeFont, height)).toEqual(true);
    });

    it('checkHeightText should return false', () => {
        const nbLine = 3;
        const sizeFont = 20;
        const height = 10;
        expect(textControl.checkHeightText(nbLine, sizeFont, height)).toEqual(false);
    });
    it('should nbLetterInLineSpy', () => {
        textControl['width'] = 20;
        const textOnCanvas = 'test';
        textControl.checkWidthText(previewCtxStub, textOnCanvas, textControl['width']);
        spyOn<any>(textControl, 'nbLetterInLine').and.callThrough();
        expect(textControl['nbLetterInLine'](previewCtxStub, textOnCanvas)).toEqual(false);
    });
    it('should nbLetterInLineSpy equal true', () => {
        textControl['width'] = 20;
        const textOnCanvas = 'test               ';
        textControl.checkWidthText(previewCtxStub, textOnCanvas, textControl['width']);
        spyOn<any>(textControl, 'nbLetterInLine').and.callThrough();
        expect(textControl['nbLetterInLine'](previewCtxStub, textOnCanvas)).toEqual(true);
    });
    it('should call endLineReturn', () => {
        const text: string[] = [];
        spyOn<any>(textControl, 'endLineReturn').and.callThrough();
        const texts = textControl['endLineReturn'](text, 'adce', 4);
        expect(text).toEqual(text);
        expect(texts[0]).toEqual('adce');
    });
    it('should call endLineReturn (2)', () => {
        const text: string[] = [];
        spyOn<any>(textControl, 'endLineReturn').and.callThrough();
        const texts = textControl['endLineReturn'](text, 'adc', 5);
        expect(text).toEqual(text);
        expect(texts[0]).toEqual('adc');
    });
    it('should call endLineReturn (3)', () => {
        const text: string[] = [];
        spyOn<any>(textControl, 'endLineReturn').and.callThrough();
        const texts = textControl['endLineReturn'](text, 'adce', 3);
        expect(text).toEqual(text);
        expect(texts[0]).toEqual('adc');
    });
    it('should font', () => {
        const styleFont = '20px "Times New Roman"';
        textControl.textFont(styleFont);
        expect(textControl['ctx'].font).toEqual(styleFont);
    });

    it('arrowTop should call textPreview ', () => {
        textControl['textPreview'] = ['a', 'b', 'c'];
        textControl['indexLine'] = 3;
        textControl.arrowTop();
        expect(textControl['indexLine']).toEqual(2);
    });
    it('arrowTop should call textPreview (2)', () => {
        textControl['textPreview'] = ['as', 'bd', 'ct'];
        textControl['indexLine'] = 2;
        textControl['indexOfLettersInLine'] = 1;
        textControl.arrowTop();
        expect(textControl['indexLine']).toEqual(1);
        expect(textControl['textLine']).toEqual(['b']);
        expect(textControl['textStack']).toEqual(['d']);
    });
    it('arrowTop should call textPreview (3)', () => {
        textControl['textPreview'] = ['as', 'bd', 'ct'];
        textControl['textLine'] = ['a'];
        textControl['textStack'] = ['s'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 1;
        textControl.arrowTop();
        expect(textControl['indexLine']).toEqual(0);
        expect(textControl['textLine']).toEqual(['a']);
        expect(textControl['textStack']).toEqual(['s']);
    });

    it('arrowBottom should call textPreview ', () => {
        textControl['textPreview'] = ['a', 'b', 'c'];
        textControl['indexLine'] = 1;
        textControl.arrowBottom();
        expect(textControl['indexLine']).toEqual(2);
    });
    it('arrowBottom should call textPreview (1)', () => {
        textControl['textPreview'] = ['a', 'b', 'c'];
        textControl['indexLine'] = 2;
        textControl.arrowBottom();
        expect(textControl['indexLine']).toEqual(2);
    });

    it('arrowLeft should call textPreview (1)', () => {
        textControl['textLine'] = ['t', 'e'];
        textControl['textStack'] = ['s', 't'];
        textControl['indexOfLettersInLine'] = 2;
        textControl.arrowLeft();
        expect(textControl['indexOfLettersInLine']).toEqual(1);
        expect(textControl['textLine']).toEqual(['t']);
    });

    it('arrowLeft should call textPreview (2)', () => {
        textControl['indexOfLettersInLine'] = 0;
        textControl['indexLine'] = 1;
        textControl['textPreview'] = ['a', 's', '2'];
        textControl['textStack'] = ['t', 's', 'e', 't'];
        textControl.arrowLeft();
        expect(textControl['indexOfLettersInLine']).toEqual(1);
        expect(textControl['indexLine']).toEqual(0);
        expect(textControl['textLine']).toEqual(['a']);
        expect(textControl['textPreview'][1]).toEqual('test');
    });

    it('arrowLeft should call textPreview (3)', () => {
        textControl['indexOfLettersInLine'] = -2;
        textControl.arrowLeft();
        expect(textControl['indexOfLettersInLine']).toEqual(0);
    });

    it('arrowRight should call textPreview ', () => {
        textControl['textStack'] = ['t', 's', 'e', 't'];
        textControl['indexOfLettersInLine'] = 0;
        textControl.arrowRight();
        expect(textControl['indexOfLettersInLine']).toEqual(1);
        expect(textControl['textLine']).toEqual(['t']);
        expect(textControl['textStack']).toEqual(['t', 's', 'e']);
    });

    it('arrowRight should call textPreview (2)', () => {
        textControl['textStack'] = ['t', 's', 'e', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 0;
        textControl['textPreview'] = ['a', 's', '2'];
        textControl.arrowRight();
        expect(textControl['indexLine']).toEqual(0);
        expect(textControl['indexOfLettersInLine']).toEqual(1);
        expect(textControl['textLine']).toEqual(['t']);
        expect(textControl['textStack']).toEqual(['t', 's', 'e']);
    });
    it('arrowRight should call textPreview (3)', () => {
        textControl['textStack'] = [];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 1;
        textControl['textPreview'] = ['a', 'sss', '2'];
        textControl.arrowRight();
        expect(textControl['indexLine']).toEqual(1);
        expect(textControl['indexOfLettersInLine']).toEqual(0);
        expect(textControl['textLine']).toEqual([]);
        expect(textControl['textStack']).toEqual(['s', 's', 's']);
    });

    it('delete', () => {
        textControl['textStack'] = ['t', 's', 'e', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 0;
        textControl.delete();
        expect(textControl['textStack']).toEqual(['t', 's', 'e']);
    });
    it('delete (2)', () => {
        textControl['textPreview'] = ['tt', 'ss', 'e', 't'];
        textControl['textLine'] = ['t', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 2;
        textControl.delete();
        expect(textControl['textStack']).toEqual(['s', 's']);
        expect(textControl['textLine']).toEqual(['t', 't']);
        expect(textControl['textPreview']).toEqual(['tt', 'e', 't']);
    });
    it('delete (3)', () => {
        textControl['textStack'] = [];
        textControl['textLine'] = ['t', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 2;
        textControl.delete();
        expect(textControl['textStack']).toEqual([]);
        expect(textControl['textLine']).toEqual(['t', 't']);
    });

    it('backspace', () => {
        textControl['textLine'] = ['t', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 2;
        textControl.backspace();
        expect(textControl['textLine']).toEqual(['t']);
    });
    it('backspace (2)', () => {
        textControl['textLine'] = ['t', 't'];
        textControl['indexLine'] = 0;
        textControl['indexOfLettersInLine'] = 0;
        textControl.backspace();
        expect(textControl['textLine']).toEqual(['t', 't']);
    });

    it('backspace (3)', () => {
        textControl['textPreview'] = ['tt', 'ss', 'e', 't'];
        textControl['textStack'] = ['s', 's'];
        textControl['textLine'] = [];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 0;
        textControl.backspace();
        expect(textControl['textStack']).toEqual(['s', 's']);
        expect(textControl['textLine']).toEqual(['t', 't']);
        expect(textControl['textPreview']).toEqual(['tt', 'e', 't']);
    });

    it('should call clearText', () => {
        textControl['width'] = 5;
        textControl['indexLine'] = 2;
        textControl['indexOfLettersInLine'] = 1;
        textControl['nbOfLettersInLine'] = 5;
        textControl['textPreview'] = ['as', 'bd', 'ct'];
        textControl['textLine'] = ['b'];
        textControl['textStack'] = ['b'];
        textControl.clearText();
        expect(textControl['width']).toEqual(0);
        expect(textControl['indexLine']).toEqual(0);
        expect(textControl['indexOfLettersInLine']).toEqual(0);
        expect(textControl['nbOfLettersInLine']).toEqual(0);
        expect(textControl['textPreview']).toEqual([]);
        expect(textControl['textLine']).toEqual([]);
        expect(textControl['textStack']).toEqual([]);
    });
    it('should call enter', () => {
        textControl['textPreview'] = ['as', 'bde', 'ct'];
        textControl['textLine'] = ['b'];
        textControl['textStack'] = ['e', 'd'];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 1;
        textControl.enter();
        expect(textControl['textPreview']).toEqual(['as', 'b', 'de', 'ct']);
        expect(textControl['textLine']).toEqual([]);
        expect(textControl['textStack']).toEqual(['e', 'd']);
    });

    it('full text (1)  call getText', () => {
        textControl.setWidth(50);
        textControl['textPreview'] = ['as', 'bde', 'ct'];
        textControl['textLine'] = ['b'];
        textControl['textStack'] = ['e', 'd'];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 1;
        const fullText = textControl.getText();
        expect(fullText).toEqual(['as', 'bde', 'ct']);
    });

    it('full text (1) call getTextWithCursor', () => {
        textControl.setWidth(50);
        textControl['textPreview'] = ['as', 'bde', 'ct'];
        textControl['textLine'] = ['b'];
        textControl['textStack'] = ['e', 'd'];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 1;
        const fullText = textControl.getTextWithCursor();
        expect(fullText).toEqual(['as', 'b|de', 'ct']);
    });
    it('should full text (2) call getText', () => {
        textControl.setWidth(20);
        textControl['textPreview'] = ['as', 'b3de', 'ct'];
        textControl['textLine'] = ['b', '3'];
        textControl['textStack'] = ['e', 'd', 'd'];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 1;
        const fullText = textControl.getText();
        expect(fullText).toEqual(['as', 'b3d', 'ct']);
    });

    it('should full text (2) call getTextWithCursor', () => {
        textControl.setWidth(18);
        textControl['textPreview'] = ['as', 'b3de', 'ct'];
        textControl['textLine'] = ['b', '3'];
        textControl['textStack'] = ['e', 'd', 'd'];
        textControl['indexLine'] = 1;
        textControl['indexOfLettersInLine'] = 1;
        const fullText = textControl.getTextWithCursor();
        expect(fullText).toEqual(['as', 'b3|', 'ct']);
    });
});
