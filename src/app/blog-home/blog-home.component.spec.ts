import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BlogHomeComponent } from './blog-home.component';
import { BlogService } from './services/blog.service';
import { provideRouter } from '@angular/router';

describe('BlogHomeComponent', () => {
  let component: BlogHomeComponent;
  let fixture: ComponentFixture<BlogHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHomeComponent],
      providers: [
        provideRouter([]),
        { provide: BlogService, useValue: { getPublishedPosts: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
