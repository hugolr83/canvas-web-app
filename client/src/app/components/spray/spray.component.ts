import { Component } from '@angular/core';
import { SprayService } from '@app/services/tools/spray.service';

// tslint:disable:no-empty

@Component({
    selector: 'app-spray',
    templateUrl: './spray.component.html',
    styleUrls: ['./spray.component.scss'],
})
export class SprayComponent {
    constructor(public sprayService: SprayService) {}
}
