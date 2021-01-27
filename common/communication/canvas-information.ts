export interface CanvasInformation {
    _id: string;
    name: string;
    labels: Label[];
    width: number;
    height: number;
    date: Date;
    picture: string; // base64
}
export interface Label {
    label: string;
}
