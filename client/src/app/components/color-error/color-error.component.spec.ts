import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { ColorErrorComponent } from '@app/components/color-error/color-error.component';

let component: ColorErrorComponent;
let fixture: ComponentFixture<ColorErrorComponent>;

describe('ColorErrorComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatButtonModule],
            declarations: [ColorErrorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
