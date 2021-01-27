import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { STAMP } from '@app/classes/stamp';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements AfterViewInit {
    constructor(public stampService: StampService, public drawingService: DrawingService) {}

    @ViewChild('stamp1', { static: false }) stamp1Canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('stamp2', { static: false }) stamp2Canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('stamp3', { static: false }) stamp3Canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('stamp4', { static: false }) stamp4Canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('stamp5', { static: false }) stamp5Canvas: ElementRef<HTMLCanvasElement>;

    stamp1Ctx: CanvasRenderingContext2D;
    stamp2Ctx: CanvasRenderingContext2D;
    stamp3Ctx: CanvasRenderingContext2D;
    stamp4Ctx: CanvasRenderingContext2D;
    stamp5Ctx: CanvasRenderingContext2D;

    image1: HTMLImageElement;
    image2: HTMLImageElement;
    image3: HTMLImageElement;
    image4: HTMLImageElement;
    image5: HTMLImageElement;

    ngAfterViewInit(): void {
        this.stamp1Ctx = this.stamp1Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.stamp2Ctx = this.stamp2Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.stamp3Ctx = this.stamp3Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.stamp4Ctx = this.stamp4Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.stamp5Ctx = this.stamp5Canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.image1 = new Image();
        this.image1.src = STAMP.stamp1;
        this.image1.onload = () => {
            this.stamp1Ctx.drawImage(
                this.image1,
                0,
                0,
                this.image1.width,
                this.image1.height,
                0,
                0,
                this.stamp1Canvas.nativeElement.width,
                this.stamp1Canvas.nativeElement.height,
            );
        };

        this.image2 = new Image();
        this.image2.src = STAMP.stamp2;
        this.image2.onload = () => {
            this.stamp2Ctx.drawImage(
                this.image2,
                0,
                0,
                this.image2.width,
                this.image2.height,
                0,
                0,
                this.stamp2Canvas.nativeElement.width,
                this.stamp2Canvas.nativeElement.height,
            );
        };

        this.image3 = new Image();
        this.image3.src = STAMP.stamp3;
        this.image3.onload = () => {
            this.stamp3Ctx.drawImage(
                this.image3,
                0,
                0,
                this.image3.width,
                this.image3.height,
                0,
                0,
                this.stamp3Canvas.nativeElement.width,
                this.stamp3Canvas.nativeElement.height,
            );
        };

        this.image4 = new Image();
        this.image4.src = STAMP.stamp4;
        this.image4.onload = () => {
            this.stamp4Ctx.drawImage(
                this.image4,
                0,
                0,
                this.image4.width,
                this.image4.height,
                0,
                0,
                this.stamp4Canvas.nativeElement.width,
                this.stamp4Canvas.nativeElement.height,
            );
        };

        this.image5 = new Image();
        this.image5.src = STAMP.stamp5;
        this.image5.onload = () => {
            this.stamp5Ctx.drawImage(
                this.image5,
                0,
                0,
                this.image5.width,
                this.image5.height,
                0,
                0,
                this.stamp5Canvas.nativeElement.width,
                this.stamp5Canvas.nativeElement.height,
            );
        };
    }

    pickStamp(source: string): void {
        this.stampService.currentStampName = source;
    }
}
