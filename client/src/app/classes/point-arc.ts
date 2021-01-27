import { Vec2 } from '@app/classes/vec2';
export class PointArc {
    constructor(vec2: Vec2, radius: number, opacity: number) {
        this.vec2 = vec2;
        this.radius = radius;
        this.opacity = opacity;
    }
    vec2: Vec2;
    radius: number;
    opacity: number;
}

export interface ColorBrush {
    primaryColor: string;
    secondaryColor: string;
}
