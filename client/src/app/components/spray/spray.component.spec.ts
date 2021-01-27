import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SprayComponent } from '@app/components/spray/spray.component';

// tslint:disable:prefer-const

describe('SprayComponent', () => {
    let component: SprayComponent;
    let fixture: ComponentFixture<SprayComponent>;
    let dialogMock: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SprayComponent],
            imports: [
                MatIconModule,
                MatGridListModule,
                MatSliderModule,
                MatSlideToggleModule,
                MatButtonToggleModule,
                MatButtonModule,
                MatListModule,
                MatInputModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                HttpClientModule,
                FormsModule,
            ],
            providers: [{ provide: MatDialog, useValue: dialogMock }],
        }).compileComponents();
        TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(SprayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
