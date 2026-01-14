import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ResumeComponent } from './resume.component';
import { Apollo } from 'apollo-angular';

const apolloStub = {
  watchQuery: (_: any) => ({ valueChanges: of({ data: { trophies: [] } }) })
};

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
      providers: [
        { provide: Apollo, useValue: apolloStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
