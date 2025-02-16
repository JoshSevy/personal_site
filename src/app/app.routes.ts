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
import { TrailingSlashGuard } from './guards/trailing-slash.guard';
import { AuthGuard } from './guards/admin/auth.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'blog', component: BlogHomeComponent, canActivate: [ TrailingSlashGuard ] },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  // Login
  { path: 'login', component: LoginComponent, canActivate: [ TrailingSlashGuard ] },

  // Admin Routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: ManagePostsComponent, canActivate: [ TrailingSlashGuard ] },
      { path: 'posts/add', component: AddPostComponent },
      { path: 'posts/edit/:id', component: EditPostComponent },
    ],
  },

  // Catch-All Route (404)
  { path: '**', component: PageNotFoundComponent },
];
