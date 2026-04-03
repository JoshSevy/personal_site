import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { ManagePostsComponent } from './manage-posts.component';
import { BlogStore } from '../../blog-home/state/blog.store';
import { BlogPost } from '../../blog-home/blog-post.model';

describe('ManagePostsComponent', () => {
  let component: ManagePostsComponent;
  let fixture: ComponentFixture<ManagePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePostsComponent],
      providers: [
        provideRouter([]),
        {
          provide: BlogStore,
          useValue: {
            allPosts: signal<BlogPost[] | null>([]),
            allPostsLoading: signal(false),
            ensureAllPostsWatch: () => {},
            deletePost: () => of({}),
          },
        },
      ],
    }).compileComponents();

    (window as unknown as { confirm: () => boolean }).confirm = () => true;

    fixture = TestBed.createComponent(ManagePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
