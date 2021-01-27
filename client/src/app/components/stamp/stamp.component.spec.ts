import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { STAMP } from '@app/classes/stamp';
import { StampComponent } from '@app/components/stamp/stamp.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('StampComponent', () => {
    let stampComponent: StampComponent;
    let fixture: ComponentFixture<StampComponent>;
    let stampStub: StampService;
    let drawingStub: DrawingService;
    let cursorStubCtx: CanvasRenderingContext2D;
    let undoRedoStub: UndoRedoService;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        stampStub = new StampService(drawingStub, undoRedoStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        cursorStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        await TestBed.configureTestingModule({
            declarations: [StampComponent],
            imports: [MatButtonModule, MatSliderModule, FormsModule, MatListModule, HttpClientModule],
            providers: [
                { provide: StampService, useValue: stampStub },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(StampComponent);
        stampComponent = fixture.componentInstance;
        drawingStub.cursorCtx = cursorStubCtx;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(stampComponent).toBeTruthy();
    });

    it('should set cursor', () => {
        stampComponent.pickStamp(STAMP.stamp1);
        expect(stampStub.currentStampName).toEqual(STAMP.stamp1);
    });
});
