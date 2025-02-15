import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResumeComponent } from './resume/resume.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { BlogPostComponent } from './blog-home/blog-post/blog-post.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ManagePostsComponent } from './admin/manage-posts/manage-posts.component';
import { AddPostComponent } from './admin/add-post/add-post.component';
import { EditPostComponent } from './admin/edit-post/edit-post.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-services/terms-of-service.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'blog', component: BlogHomeComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'admin', component: AdminDashboardComponent, children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: ManagePostsComponent },
      { path: 'posts/add', component: AddPostComponent },
      { path: 'posts/edit/:id', component: EditPostComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent}
];
