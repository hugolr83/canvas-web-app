import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RGBA } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import { ColorComponent } from '@app/components/color/color.component';
import { ColorService, LastColor } from '@app/services/color/color.service';
import { PaintBucketService } from '@app/services/tools/paint-bucket.service';

const MAX_VALUE_RGB = 255;

@Component({
    selector: 'app-paint-bucket-color',
    templateUrl: './paint-bucket-color.component.html',
    styleUrls: ['./paint-bucket-color.component.scss'],
})
export class PaintBucketColorComponent extends ColorComponent implements AfterViewInit {
    readonly WIDTH: number = 207;
    readonly SQUARE_HEIGHT: number = 200;
    horizontalHeight: number = 20;

    @ViewChild('previewSquare') previewSquare: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('squarePalette') squareCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewHorizontal') previewHorizontal: ElementRef<HTMLCanvasElement>; // used to do a hover position
    @ViewChild('horizontalPalette') horizontalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('opacitySlider') opacitySliderCanvas: ElementRef<HTMLCanvasElement>; // to have an opacity slider
    @ViewChild('opacitySliderPreview') opacitySliderPreview: ElementRef<HTMLCanvasElement>; // to have a hover
    @ViewChild('message', { static: false }) messageRGB: TemplateRef<HTMLElement>;

    protected squareDimension: Vec2 = { x: this.WIDTH, y: this.SQUARE_HEIGHT };
    protected horizontalDimension: Vec2 = { x: this.WIDTH, y: this.horizontalHeight };

    protected previewSquareCtx: CanvasRenderingContext2D;
    protected squareCtx: CanvasRenderingContext2D;

    protected previewHorizontalCtx: CanvasRenderingContext2D;
    protected horizontalCtx: CanvasRenderingContext2D;

    protected opacitySliderCtx: CanvasRenderingContext2D;
    protected previewOpacitySliderCtx: CanvasRenderingContext2D;

    lastColors: LastColor[];

    protected color: string;

    constructor(
        protected iconRegistry: MatIconRegistry,
        protected sanitizer: DomSanitizer,
        public colorService: ColorService,
        public matDialog: MatDialog,
        public errorMsg: MatDialog,
        public paintBucketService: PaintBucketService,
    ) {
        super(iconRegistry, sanitizer, colorService, matDialog, errorMsg);
        this.iconRegistry.addSvgIcon('red', this.sanitizer.bypassSecurityTrustResourceUrl('assets/apple.svg'));
        this.iconRegistry.addSvgIcon('green', this.sanitizer.bypassSecurityTrustResourceUrl('assets/leaf.svg'));
        this.iconRegistry.addSvgIcon('blue', this.sanitizer.bypassSecurityTrustResourceUrl('assets/wave.svg'));
        this.iconRegistry.addSvgIcon('alpha', this.sanitizer.bypassSecurityTrustResourceUrl('assets/transparency.svg'));
    }

    onMouseOverSquareClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.drawSquarePalette();
        this.drawOpacitySlider();
    }

    onMouseOverHorizontalClick(event: MouseEvent): void {
        if (this.colorService.isClicked) {
            this.colorService.primaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.primaryColor);
        } else {
            this.colorService.secondaryColor = this.colorService.previewColor;
            this.colorService.addLastColor(this.colorService.secondaryColor);
        }
        this.colorService.selectedColor = this.colorService.previewColor;
        this.colorService.colorStopperPosition = event;
        this.colorService.drawMovingStopper(this.previewHorizontalCtx, { x: this.WIDTH, y: this.horizontalHeight }, event);
        this.drawSquarePalette();
        this.drawHorizontalPalette();
        this.drawOpacitySlider();
    }

    sendInput(rgb: RGBA): void {
        if (!rgb.red && !rgb.green && !rgb.blue && rgb.alpha >= 0 && rgb.alpha <= 1) {
            this.colorService.changeColorOpacity(rgb.alpha);
        } else if (rgb.red <= MAX_VALUE_RGB && rgb.green <= MAX_VALUE_RGB && rgb.blue <= MAX_VALUE_RGB && rgb.alpha <= 1 && rgb.alpha >= 0) {
            this.color = this.colorService.numeralToHex(rgb);
            this.colorService.primaryColor = this.color;
            this.colorService.changeColorOpacity(rgb.alpha);
        } else {
            this.openWarningMessage();
        }
    }

    formatLabel(value: number): number {
        return value;
    }
}
