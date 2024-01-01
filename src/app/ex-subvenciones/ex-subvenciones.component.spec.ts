import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExSubvencionesComponent } from './ex-subvenciones.component';

describe('ExSubvencionesComponent', () => {
  let component: ExSubvencionesComponent;
  let fixture: ComponentFixture<ExSubvencionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExSubvencionesComponent]
    });
    fixture = TestBed.createComponent(ExSubvencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
