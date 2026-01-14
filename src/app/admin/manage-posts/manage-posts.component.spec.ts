import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManagePostsComponent } from './manage-posts.component';
import { BlogService } from '../../blog-home/services/blog.service';

const blogServiceStub = {
  getPosts: () => of([]),
  deletePost: (id: string) => of({})
};

const routerStub = { navigate: () => {} };

describe('ManagePostsComponent', () => {
  let component: ManagePostsComponent;
  let fixture: ComponentFixture<ManagePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePostsComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub },
        { provide: 'Router', useValue: routerStub }
      ]
    })
    .compileComponents();

    // Stub window.confirm to avoid dialog
    (window as any).confirm = () => true;

    fixture = TestBed.createComponent(ManagePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
