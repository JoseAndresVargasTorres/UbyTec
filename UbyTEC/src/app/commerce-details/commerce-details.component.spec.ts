import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommerceDetailsComponent } from './commerce-details.component';

describe('CommerceDetailsComponent', () => {
  let component: CommerceDetailsComponent;
  let fixture: ComponentFixture<CommerceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommerceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommerceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
