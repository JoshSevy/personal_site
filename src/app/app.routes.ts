import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResumeComponent } from './resume/resume.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { BlogPostComponent } from './blog-home/blog-post/blog-post.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'blog', component: BlogHomeComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'admin', component: AdminDashboardComponent, children: [
      { path: 'posts', component: ManagePostsComponent },
      { path: 'posts/add', component: AddPostComponent },
      { path: 'posts/edit/:id', component: EditPostComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent}
];
