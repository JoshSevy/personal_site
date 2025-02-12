import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfConditionsComponent } from './terms-of-service.component';

describe('TermsOfConditionsComponent', () => {
  let component: TermsOfConditionsComponent;
  let fixture: ComponentFixture<TermsOfConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsOfConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
