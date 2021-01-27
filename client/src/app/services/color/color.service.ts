import { Injectable } from '@angular/core';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum GradientStyle {
    rainbow,
    lightToDark,
    colorToColor,
}
export interface LastColor {
    color?: string;
    active: boolean;
}
export const COLORS_HISTORY_SIZE = 10;
const SLIDER_STOPPER_RECT_WIDTH = 2;
const SLIDER_STOPPER_RECT_HEIGHT = 20;

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string = '#000000';
    secondaryColor: string = '#ff6666';
    selectedColor: string = this.primaryColor;
    previewColor: string = '#ff6666';
    primaryColorTransparency: number;
    secondaryColorTransparency: number;
    isClicked: boolean = true;
    private lastColors: LastColor[];

    squareStopperPosition: MouseEvent = { offsetX: NaN, offsetY: NaN } as MouseEvent;
    colorStopperPosition: MouseEvent = { offsetX: NaN, offsetY: NaN } as MouseEvent;
    alphaStopperPosition: MouseEvent = { offsetX: NaN, offsetY: NaN } as MouseEvent;

    constructor(private drawingService: DrawingService) {
        this.lastColors = new Array(COLORS_HISTORY_SIZE);
        this.lastColors.fill({ active: false });
    }

    getLastColors(): LastColor[] {
        return this.lastColors;
    }

    addLastColor(color: string): void {
        this.lastColors.shift();
        this.lastColors.push({ color, active: true });
    }

    // https://malcoded.com/posts/angular-color-picker/
    // I copied the gradient made at that position
    private rainbowGradient(gradient: CanvasGradient): void {
        // fractions make more sense to do separation between colors
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(2.1 / 6, 'rgba(0, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(3.1 / 6, 'rgba(0, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(4.1 / 6, 'rgba(0, 0, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(5.1 / 6, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    }

    // This one is completely my creation
    private lightToDark(gradient: CanvasGradient, hexColor: string): void {
        // fractions make more sense to do separation between colors
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 2, hexColor);
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    }
    // This gradient is used for the opacity.
    private colorToColor(gradient: CanvasGradient, hexColor: string): void {
        // fractions make more sense to do separation between colors
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 2, hexColor);
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    }

    // Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
    // is some form of paraphrasing and recoding to make it adapted to our use cases.
    // https://malcoded.com/posts/angular-color-picker/
    // Drawing a rainbow-gradient

    drawPalette(ctx: CanvasRenderingContext2D, dimension: Vec2, style: GradientStyle): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        let gradient;

        switch (style) {
            case GradientStyle.lightToDark:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.lightToDark(gradient, this.selectedColor);
                break;
            case GradientStyle.colorToColor:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.colorToColor(gradient, this.selectedColor);
                break;
            case GradientStyle.rainbow:
            default:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.rainbowGradient(gradient); // choose which gradient
                break;
        }

        ctx.beginPath();
        ctx.rect(0, 0, dimension.x, dimension.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    drawMovingStopper(ctx: CanvasRenderingContext2D, dimension: Vec2, event: MouseEvent): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(event.offsetX, 0, SLIDER_STOPPER_RECT_WIDTH, SLIDER_STOPPER_RECT_HEIGHT);
    }

    // This code has been inspired by the following link.
    // https://malcoded.com/posts/angular-color-picker/#detecting-mouse-events-on-the-color-slider
    getColor(position: Vec2, ctx: CanvasRenderingContext2D): RGBA {
        const imageData = ctx.getImageData(position.x, position.y, 1, 1).data;
        return { red: imageData[0], green: imageData[1], blue: imageData[2], alpha: 1 };
    }

    changeColorOpacity(alpha: number): void {
        if (this.isClicked) {
            this.primaryColorTransparency = alpha;
            this.drawingService.baseCtx.globalAlpha = this.primaryColorTransparency;
            this.drawingService.previewCtx.globalAlpha = this.primaryColorTransparency;
        } else {
            this.secondaryColorTransparency = alpha;
            this.drawingService.baseCtx.globalAlpha = this.secondaryColorTransparency;
            this.drawingService.previewCtx.globalAlpha = this.secondaryColorTransparency;
        }
    }

    swapColor(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }
    // We suppose that each number of the rgb space is between 0 to 255
    // Shameless copy paste of this link
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    numeralToHex(rgb: RGBA): string {
        const converter = (zeroTo256: number) => {
            const hex = zeroTo256.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + converter(rgb.red) + converter(rgb.green) + converter(rgb.blue);
    }
}
