import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorErrorComponent } from './components/color-error/color-error.component';
import { ColorComponent } from './components/color/color.component';
import { CarouselComponent } from './components/dialog-carrousel-picture/dialog-carrousel-picture.component';
import { DialogCreateNewDrawingComponent } from './components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DialogExportEmailComponent } from './components/dialog-export-email/dialog-export-email.component';
import { DialogExportDrawingComponent } from './components/dialog-export-locally/dialog-export-locally.component';
import { DialogUploadComponent } from './components/dialog-upload/dialog-upload.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { DropperColorComponent } from './components/dropper-color/dropper-color.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PaintBucketColorComponent } from './components/paint-bucket-color/paint-bucket-color.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SprayComponent } from './components/spray/spray.component';
import { StampComponent } from './components/stamp/stamp.component';
import { WriteTextDialogUserGuideComponent } from './components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { WriteTextOptionComponent } from './components/write-text-option/write-text-option.component';

@NgModule({
    declarations: [
        AppComponent,
        CarouselComponent,
        ColorComponent,
        ColorErrorComponent,
        DialogCreateNewDrawingComponent,
        DrawingComponent,
        DropperColorComponent,
        EditorComponent,
        MainPageComponent,
        DialogCreateNewDrawingComponent,
        DialogExportDrawingComponent,
        SidebarComponent,
        StampComponent,
        SprayComponent,
        WriteTextDialogUserGuideComponent,
        ColorComponent,
        CarouselComponent,
        DropperColorComponent,
        DialogUploadComponent,
        PaintBucketColorComponent,
        DialogExportEmailComponent,
        WriteTextOptionComponent,
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
