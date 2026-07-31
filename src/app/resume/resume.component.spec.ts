import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ResumeComponent } from './resume.component';
import { Apollo } from 'apollo-angular';

const sampleStats = {
  username: 'JoshSevy',
  publicRepos: 116,
  sourceRepos: 78,
  memberSince: '2019',
  topLanguages: [
    { name: 'TypeScript', repoCount: 20 },
    { name: 'C++', repoCount: 5 },
  ],
};

function apolloReturning(value: unknown) {
  return { query: (_: unknown) => of({ data: { githubStats: value } }) };
}

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  async function setup(apolloStub: unknown) {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
      providers: [{ provide: Apollo, useValue: apolloStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup(apolloReturning(sampleStats));
    expect(component).toBeTruthy();
  });

  it('maps stats and scales language bars against the most-used language', async () => {
    await setup(apolloReturning(sampleStats));
    const stats = component.stats();
    expect(stats?.sourceRepos).toBe(78);
    expect(stats?.memberSince).toBe('2019');
    // TypeScript is the max, so it anchors the scale at 100%.
    expect(stats?.topLanguages[0]).toEqual({ name: 'TypeScript', repoCount: 20, share: 100 });
    expect(stats?.topLanguages[1]).toEqual({ name: 'C++', repoCount: 5, share: 25 });
  });

  it('hides the section instead of hanging when the query fails', async () => {
    await setup({ query: () => throwError(() => new Error('network down')) });
    expect(component.stats()).toBeUndefined();
    expect(component.loading()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Loading GitHub activity');
  });

  it('hides the section when the API returns no stats', async () => {
    await setup(apolloReturning(null));
    expect(component.stats()).toBeUndefined();
  });
});
