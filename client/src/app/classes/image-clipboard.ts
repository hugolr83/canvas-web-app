import { Vec2 } from './vec2';

export class ImageClipboard {
    imageData: ImageData;
    image: HTMLImageElement = new Image();
    imagePosition: Vec2;
    width: number;
    height: number;
    start: Vec2;
    end: Vec2;
    imageSize: Vec2;
    ellipseRadian: Vec2;
}
