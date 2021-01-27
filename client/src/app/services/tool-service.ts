import { Injectable } from '@angular/core';
import { Tool, ToolUsed } from '@app/classes/tool';
import { DropperService } from '@app/services/tools/dropper.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { BrushService } from './tools/brush.service';
import { EllipseService } from './tools/ellipse.service';
import { FeatherService } from './tools/feather.service';
import { LineService } from './tools/line.service';
import { PaintBucketService } from './tools/paint-bucket.service';
import { PolygonService } from './tools/polygon.service';
import { MagicWandService } from './tools/selection-service/magic-wand.service';
import { SelectionEllipseService } from './tools/selection-service/selection-ellipse.service';
import { SelectionRectangleService } from './tools/selection-service/selection-rectangle.service';
import { SprayService } from './tools/spray.service';
import { StampService } from './tools/stamp.service';
import { TextService } from './tools/text.service';

@Injectable({
    providedIn: 'root',
})
export class ToolService {
    currentToolName: ToolUsed;
    currentTool: Tool;
    private tableTool: Tool[] = new Array();

    constructor(
        private pencilService: PencilService,
        private eraserService: EraserService,
        private brushService: BrushService,
        private lineService: LineService,
        private rectangleService: RectangleService,
        private ellipseService: EllipseService,
        private dropperService: DropperService,
        private polygonService: PolygonService,
        private paintBucketService: PaintBucketService,
        private selectionRectangleService: SelectionRectangleService,
        private selectionEllipseService: SelectionEllipseService,
        private magicWandService: MagicWandService,
        private sprayService: SprayService,
        private featherService: FeatherService,
        private textService: TextService,
        private stampService: StampService,
    ) {
        this.tableTool[ToolUsed.NONE] = this.pencilService;
        this.tableTool[ToolUsed.Pencil] = this.pencilService;
        this.tableTool[ToolUsed.Eraser] = this.eraserService;
        this.tableTool[ToolUsed.Brush] = this.brushService;
        this.tableTool[ToolUsed.Line] = this.lineService;
        this.tableTool[ToolUsed.Rectangle] = this.rectangleService;
        this.tableTool[ToolUsed.Ellipse] = this.ellipseService;
        this.tableTool[ToolUsed.Dropper] = this.dropperService;
        this.tableTool[ToolUsed.SelectionRectangle] = this.selectionRectangleService;
        this.tableTool[ToolUsed.SelectionEllipse] = this.selectionEllipseService;
        this.tableTool[ToolUsed.Polygon] = this.polygonService;
        this.tableTool[ToolUsed.PaintBucket] = this.paintBucketService;
        this.tableTool[ToolUsed.Spray] = this.sprayService;
        this.tableTool[ToolUsed.Feather] = this.featherService;
        this.tableTool[ToolUsed.Text] = this.textService;
        this.tableTool[ToolUsed.MagicWand] = this.magicWandService;
        this.tableTool[ToolUsed.Stamp] = this.stampService;

        this.switchTool(ToolUsed.NONE); // default tools if all else fail in the sidebar usually
    }

    switchTool(toolUsed: ToolUsed): void {
        // color is special as we don't change tool per say, we are simply making an extension of making other tools
        // change color
        if (this.currentToolName === ToolUsed.Text && toolUsed !== ToolUsed.Text) {
            this.textService.drawText();
        }
        // same for grid, we just want to show the ui modifier
        if (toolUsed !== ToolUsed.Color && toolUsed !== ToolUsed.Grid) {
            this.currentTool = this.tableTool[toolUsed];
        }
        this.currentTool.cleanPaintGrout();
        this.currentToolName = toolUsed;
    }
}
