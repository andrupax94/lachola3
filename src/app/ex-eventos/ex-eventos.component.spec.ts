import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExEventosComponent } from './ex-eventos.component';

describe('ExEventosComponent', () => {
  let component: ExEventosComponent;
  let fixture: ComponentFixture<ExEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExEventosComponent]
    });
    fixture = TestBed.createComponent(ExEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
