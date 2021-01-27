import { TestBed } from '@angular/core/testing';
import { ToolService } from '@app/services/tool-service';

describe('SwitchToolServiceService', () => {
    let service: ToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
