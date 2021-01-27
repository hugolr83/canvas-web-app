import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToolUsed } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { ToolService } from '@app/services/tool-service';
import { DropperService } from '@app/services/tools/dropper.service';

@Component({
    selector: 'app-dropper-color',
    templateUrl: './dropper-color.component.html',
    styleUrls: ['./dropper-color.component.scss'],
})
export class DropperColorComponent implements AfterViewInit {
    @ViewChild('previewColor', { static: false }) previewColor: ElementRef<HTMLCanvasElement>;
    constructor(public colorService: ColorService, public dropperService: DropperService, public toolService: ToolService) {}

    circleCtx: CanvasRenderingContext2D;

    get dropper(): ToolUsed.Dropper {
        return ToolUsed.Dropper;
    }

    ngAfterViewInit(): void {
        this.circleCtx = this.previewColor.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.dropperService.circleCtx = this.circleCtx;
    }
}
