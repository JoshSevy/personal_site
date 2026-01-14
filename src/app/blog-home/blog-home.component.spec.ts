import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BlogHomeComponent } from './blog-home.component';
import { BlogService } from './services/blog.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';

describe('BlogHomeComponent', () => {
  let component: BlogHomeComponent;
  let fixture: ComponentFixture<BlogHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHomeComponent, RouterLink, AsyncPipe, SanitizeHtmlPipe],
      providers: [{ provide: BlogService, useValue: { getPosts: () => of([]) } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
