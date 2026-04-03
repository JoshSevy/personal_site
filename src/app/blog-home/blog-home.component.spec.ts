import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { BlogHomeComponent } from './blog-home.component';
import { BlogPost } from './blog-post.model';
import { BlogStore } from './state/blog.store';
import { provideRouter } from '@angular/router';

describe('BlogHomeComponent', () => {
  let component: BlogHomeComponent;
  let fixture: ComponentFixture<BlogHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: BlogStore,
          useValue: {
            publishedPosts: signal<BlogPost[] | null>([]),
            publishedLoading: signal(false),
            ensurePublishedWatch: () => {},
          },
        },
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
