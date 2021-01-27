import { SubToolSelected } from '@app/classes/sub-tool-selected';

export interface ToolGeneralInfo {
    primaryColor: string;
    secondaryColor: string;
    lineWidth: number;
    shiftPressed: boolean;
    selectSubTool: SubToolSelected;
    canvasSelected: boolean;
}
