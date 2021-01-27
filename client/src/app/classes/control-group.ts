import { DrawingService } from '@app/services/drawing/drawing.service';
import { ControlPoint, ControlPointName, CONTROLPOINT_SIZESIZE } from './control-points';
import { Vec2 } from './vec2';

export class ControlGroup {
    drawingService: DrawingService;

    // the next variable is not linked to the selection service
    controlPointName: ControlPointName = ControlPointName.none;
    controlPoints: Map<ControlPointName, ControlPoint> = new Map<ControlPointName, ControlPoint>();
    sizeControlGroup: Vec2;

    constructor(drawingService: DrawingService) {
        this.drawingService = drawingService;

        this.controlPoints.set(ControlPointName.center, new ControlPoint(this.drawingService));

        this.controlPoints.set(ControlPointName.topLeft, new ControlPoint(this.drawingService));
        this.controlPoints.set(ControlPointName.top, new ControlPoint(this.drawingService));
        this.controlPoints.set(ControlPointName.topRight, new ControlPoint(this.drawingService));

        this.controlPoints.set(ControlPointName.left, new ControlPoint(this.drawingService));
        this.controlPoints.set(ControlPointName.right, new ControlPoint(this.drawingService));

        this.controlPoints.set(ControlPointName.bottomRight, new ControlPoint(this.drawingService));
        this.controlPoints.set(ControlPointName.bottom, new ControlPoint(this.drawingService));
        this.controlPoints.set(ControlPointName.bottomLeft, new ControlPoint(this.drawingService));
    }

    draw(): void {
        for (const entry of Array.from(this.controlPoints.entries())) {
            const controlPoint = entry[1];
            controlPoint.draw();
        }
    }

    setPositions(startingPos: Vec2, endingPos: Vec2, size: Vec2): void {
        (this.controlPoints.get(ControlPointName.center) as ControlPoint).setPosition({
            x: startingPos.x + size.x / 2 - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y + size.y / 2 - CONTROLPOINT_SIZESIZE / 2,
        });

        (this.controlPoints.get(ControlPointName.topLeft) as ControlPoint).setPosition({
            x: startingPos.x - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });
        (this.controlPoints.get(ControlPointName.top) as ControlPoint).setPosition({
            x: startingPos.x + size.x / 2 - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });
        (this.controlPoints.get(ControlPointName.topRight) as ControlPoint).setPosition({
            x: startingPos.x + size.x - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });

        (this.controlPoints.get(ControlPointName.left) as ControlPoint).setPosition({
            x: startingPos.x - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y + size.y / 2 - CONTROLPOINT_SIZESIZE / 2,
        });
        (this.controlPoints.get(ControlPointName.right) as ControlPoint).setPosition({
            x: startingPos.x + size.x - CONTROLPOINT_SIZESIZE / 2,
            y: startingPos.y + size.y / 2 - CONTROLPOINT_SIZESIZE / 2,
        });

        (this.controlPoints.get(ControlPointName.bottomLeft) as ControlPoint).setPosition({
            x: endingPos.x - CONTROLPOINT_SIZESIZE / 2,
            y: endingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });
        (this.controlPoints.get(ControlPointName.bottom) as ControlPoint).setPosition({
            x: endingPos.x - size.x / 2 - CONTROLPOINT_SIZESIZE / 2,
            y: endingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });
        (this.controlPoints.get(ControlPointName.bottomRight) as ControlPoint).setPosition({
            x: endingPos.x - size.x - CONTROLPOINT_SIZESIZE / 2,
            y: endingPos.y - CONTROLPOINT_SIZESIZE / 2,
        });
    }

    private drawControlPoint(controlPointName: ControlPointName, controlPoint: ControlPoint, mouse: Vec2): ControlPointName {
        if (controlPoint.isInside(mouse)) {
            this.resetSelected();
            if (!controlPoint.selected) {
                controlPoint.selected = true;
                this.controlPointName = controlPointName;
            }
            controlPoint.draw();
            return controlPointName;
        }
        return ControlPointName.none;
    }

    // tslint:disable:cyclomatic-complexity
    isInControlPoint(mouse: Vec2): ControlPointName {
        for (const entry of Array.from(this.controlPoints.entries())) {
            const controlPointName = entry[0];
            const controlPoint = entry[1];
            if (this.drawControlPoint(controlPointName, controlPoint, mouse) !== ControlPointName.none) {
                return controlPointName;
            }
        }

        return ControlPointName.none;
    }

    private resetSelected(): void {
        for (const entry of Array.from(this.controlPoints.entries())) {
            const controlPoint = entry[1];
            controlPoint.selected = false;
        }
    }
}
