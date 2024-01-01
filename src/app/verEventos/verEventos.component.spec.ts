import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEventosComponent } from './verEventos.component';

describe('VerEventosComponent', () => {
    let component: VerEventosComponent;
    let fixture: ComponentFixture<VerEventosComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VerEventosComponent]
        });
        fixture = TestBed.createComponent(VerEventosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
