import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolUsed } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DropperColorComponent } from './dropper-color.component';

describe('DropperColorComponent', () => {
    let component: DropperColorComponent;
    let fixture: ComponentFixture<DropperColorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DropperColorComponent],
            imports: [
                MatGridListModule,
                MatIconModule,
                MatButtonToggleModule,
                MatButtonModule,
                MatListModule,
                BrowserAnimationsModule,
                HttpClientModule,
            ],
            providers: [{ provide: ColorService, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropperColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return dropper', () => {
        expect(component.dropper).toEqual(ToolUsed.Dropper);
    });
});
