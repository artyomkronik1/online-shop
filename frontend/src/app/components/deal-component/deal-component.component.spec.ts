import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealComponentComponent } from './deal-component.component';

describe('DealComponentComponent', () => {
  let component: DealComponentComponent;
  let fixture: ComponentFixture<DealComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealComponentComponent]
    });
    fixture = TestBed.createComponent(DealComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
