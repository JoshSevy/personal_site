import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EditPostComponent } from './edit-post.component';
import { BlogService } from '../../blog-home/services/blog.service';

const blogServiceStub = {
  getPostById: (id: string) => of({ id, title: 't', content: 'c', author: 'a' }),
  updatePost: (id: string, post: any) => of({})
};

const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: { paramMap: { get: (k: string) => '1' } } as any
};

const routerStub: Partial<Router> = { navigate: () => Promise.resolve(true) as any };

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
