import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSubvencionesComponent } from './ver-subvenciones.component';

describe('VerSubvencionesComponent', () => {
  let component: VerSubvencionesComponent;
  let fixture: ComponentFixture<VerSubvencionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerSubvencionesComponent]
    });
    fixture = TestBed.createComponent(VerSubvencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
