import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { BlogService } from '../../blog-home/services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BlogPost } from '../../blog-home/blog-post.model';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let blogServiceStub: Partial<BlogService>;

  blogServiceStub = {
    getPosts: () => {
      return of([]) as Observable<BlogPost[]>;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub },
        { provide: ActivatedRoute, useValue: () => {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
