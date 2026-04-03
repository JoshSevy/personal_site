import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { AddPostComponent } from './add-post.component';
import { BlogService } from '../../blog-home/services/blog.service';
import { SupabaseService } from '../../services/supabase.service';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;

  const blogServiceStub = {
    createPost: () => of({}),
  };

  const supabaseStub = {
    uploadBlogHeroImage: async () => null as string | null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        provideRouter([]),
        { provide: BlogService, useValue: blogServiceStub },
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    }).compileComponents();

    (window as unknown as { alert: () => void }).alert = () => {};

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
