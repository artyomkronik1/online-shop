import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleLoadingComponent } from './toggle-loading.component';

describe('ToggleLoadingComponent', () => {
  let component: ToggleLoadingComponent;
  let fixture: ComponentFixture<ToggleLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleLoadingComponent]
    });
    fixture = TestBed.createComponent(ToggleLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
