export class TextControl {
    private width: number = 0;
    private textPreview: string[] = [];
    private textLine: string[] = [];
    private textStack: string[] = [];
    private indexLine: number = 0;
    private indexOfLettersInLine: number = 0;
    private nbOfLettersInLine: number = 0;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, width?: number) {
        if (width !== undefined) this.setWidth(width);
        this.ctx = ctx;
    }

    clearText(): void {
        this.width = 0;
        this.indexLine = 0;
        this.indexOfLettersInLine = 0;
        this.nbOfLettersInLine = 0;
        this.textPreview = [];
        this.textLine = [];
        this.textStack = [];
    }
    setCtx(ctx: CanvasRenderingContext2D): void {
        this.ctx = ctx;
    }
    setWidth(width: number): void {
        this.width = Math.abs(width);
    }
    textFont(font: string): void {
        this.ctx.font = font;
    }
    addLetter(letter: string): void {
        // tslint:disable:prefer-for-of
        for (let index = 0; index < letter.length; index++) {
            this.textLine.push(letter[index]);
            this.indexOfLettersInLine++;
        }
    }
    getFont(): string {
        return this.ctx.font;
    }
    arrowTop(): void {
        if (this.indexLine >= 1 && this.indexLine <= this.textPreview.length) {
            this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
            this.indexLine--;
            this.setCursorPos();
            this.indexOfLettersInLine = this.textLine.length;
        }
    }

    arrowBottom(): void {
        if (this.indexLine < this.textPreview.length - 1) {
            this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
            this.indexLine++;
            this.setCursorPos();
            this.indexOfLettersInLine = this.textLine.length;
        }
    }

    private setCursorPos(): void {
        const textLine: string = this.textPreview[this.indexLine];
        this.textLine = [];
        this.textStack = [];
        for (let index = 0; index < textLine.length; index++) {
            if (this.indexOfLettersInLine > index) {
                this.textLine.push(textLine[index]);
            } else {
                index = textLine.length;
            }
        }
        for (let index = textLine.length - 1; index >= this.indexOfLettersInLine; index--) {
            this.textStack.push(textLine[index]);
        }
    }

    arrowLeft(): void {
        this.indexOfLettersInLine--;
        if (this.textLine.length >= 0) {
            const letter: string | undefined = this.textLine.pop();
            if (letter !== undefined) {
                this.textStack.push(letter);
            }
        }
        if (this.indexOfLettersInLine < 0 && this.indexLine >= 1) {
            this.getText();
            this.textLine = [];
            this.textStack = [];
            this.indexLine--;
            const lineText: string = this.textPreview[this.indexLine];
            if (lineText !== undefined) {
                this.indexOfLettersInLine = lineText.length;
                for (let index = 0; index <= this.indexOfLettersInLine - 1; index++) {
                    this.textLine.push(lineText[index]);
                }
            }
        }
        if (this.indexOfLettersInLine < 0) {
            this.indexOfLettersInLine = 0;
        }
    }

    arrowRight(): void {
        let checkArrowRight = true;
        if (this.textStack.length >= 0) {
            const letter: string | undefined = this.textStack.pop();
            if (letter !== undefined) {
                this.textLine.push(letter);
                this.indexOfLettersInLine++;
                checkArrowRight = false;
            }
        }
        if (checkArrowRight && this.textStack.length === 0 && this.indexLine < this.textPreview.length - 1) {
            this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '');
            this.textLine = [];
            this.textStack = [];
            this.indexOfLettersInLine = 0;
            this.indexLine++;
            const lineText = this.textPreview[this.indexLine];
            if (lineText !== undefined) {
                for (let index = lineText.length - 1; index >= 0; index--) {
                    this.textStack.push(lineText[index]);
                }
            }
        }
    }

    backspace(): void {
        this.indexOfLettersInLine--;
        if (this.indexOfLettersInLine >= 0) {
            this.textLine.pop();
        }
        if (this.indexOfLettersInLine < 0 && this.indexLine >= 1) {
            this.textPreview[this.indexLine] = '';
            for (let index = this.indexLine; index < this.textPreview.length; index++) {
                this.textPreview[index] = this.textPreview[index + 1];
            }
            this.textPreview.pop();
            this.indexLine--;
            this.textLine = [];
            const textLine = this.textPreview[this.indexLine];
            if (textLine !== undefined) {
                for (let index = 0; index < textLine.length; index++) {
                    this.textLine[index] = textLine[index];
                }
                this.indexOfLettersInLine = this.textLine.length;
            }
        }
        if (this.indexOfLettersInLine < 0) {
            this.indexOfLettersInLine = 0;
        }
    }

    delete(): void {
        if (this.textStack.length) {
            this.textStack.pop();
        } else if (!this.textStack.length && this.indexLine < this.textPreview.length - 1) {
            const textLine = this.textPreview[this.indexLine + 1];
            for (let index = this.indexLine + 1; index < this.textPreview.length; index++) {
                this.textPreview[index] = this.textPreview[index + 1];
            }
            this.textPreview.pop();
            // tslint:disable:prefer-for-of
            for (let index = 0; index < textLine.length; index++) {
                this.textStack.push(textLine[index]);
            }
        }
    }

    enter(): void {
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '');
        for (let index = this.textPreview.length - 1; index > this.indexLine; index--) {
            this.textPreview[index + 1] = this.textPreview[index];
        }
        this.indexOfLettersInLine = 0;
        this.textLine = [];
        this.indexLine++;
        this.textPreview[this.indexLine] = this.tmpLineTextStack();
    }

    private tmpLineText(text: string[], addLetter: string): string {
        let lineText = '';
        text.forEach((letter) => {
            lineText += letter;
        });
        lineText += addLetter;

        return lineText;
    }
    private tmpLineTextStack(): string {
        let text = '';

        if (this.textStack.length)
            for (let index = this.textStack.length - 1; index >= 0; index--) {
                text += this.textStack[index];
            }
        return text;
    }

    getText(): string[] {
        let tmpText: string[] = [];
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
        this.textPreview.forEach((element) => {
            if (this.nbLetterInLine(this.ctx, element)) {
                tmpText = this.endLineReturn(tmpText, element, this.nbOfLettersInLine);
            } else {
                tmpText.push(element);
            }
        });
        return tmpText;
    }

    getTextWithCursor(): string[] {
        let tmpText: string[] = [];
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + '|' + this.tmpLineTextStack();
        this.textPreview.forEach((element) => {
            if (this.nbLetterInLine(this.ctx, element)) {
                tmpText = this.endLineReturn(tmpText, element, this.nbOfLettersInLine);
            } else {
                tmpText.push(element);
            }
        });
        return tmpText;
    }

    private endLineReturn(text: string[], line: string, nbOfLettersInLine: number): string[] {
        let oneLine = '';
        // tslint:disable:prefer-for-of
        for (let index = 0; index < line.length; index++) {
            const element = line[index];
            if (oneLine.length + 1 >= nbOfLettersInLine) {
                oneLine += element;
                text.push(oneLine);
                return text;
            } else {
                oneLine += element;
            }
        }
        text.push(oneLine);
        return text;
    }

    // number of letters in a single line
    private nbLetterInLine(ctx: CanvasRenderingContext2D, text: string): boolean {
        let nbOfLetters = '';
        // tslint:disable:prefer-for-of
        for (let index = 0; index < text.length; index++) {
            nbOfLetters += text[index];
            if (!this.checkWidthText(ctx, nbOfLetters, this.width)) {
                this.nbOfLettersInLine = index;
                return true;
            }
        }
        return false;
    }

    // Check if text size < preview rectangle width (line return)
    checkWidthText(ctx: CanvasRenderingContext2D, text: string, width: number): boolean {
        return Math.abs(ctx.measureText(text).width) <= Math.abs(width);
    }

    // Check if text size < preview rectangle height (do not show text in the opposite case)
    checkHeightText(nbLineBreak: number, sizeFont: number, height: number): boolean {
        return (nbLineBreak + 1) * sizeFont <= Math.abs(height + 1);
    }
}
