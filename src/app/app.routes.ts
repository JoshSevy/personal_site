import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResumeComponent } from './resume/resume.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TrailingSlashGuard } from './guards/trailing-slash.guard';
import { AuthGuard } from './guards/admin/auth.guard';

export const routes: Routes = [
  // Public Routes - Eager loaded for immediate access
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  
  // Secret Terminal Route - Lazy loaded
  { 
    path: 'terminal', 
    loadComponent: () => import('./components/interactive-terminal/interactive-terminal.component').then(m => m.InteractiveTerminalComponent)
  },
  
  // Blog Routes - Lazy loaded
  { 
    path: 'blog', 
    loadComponent: () => import('./blog-home/blog-home.component').then(m => m.BlogHomeComponent),
    canActivate: [TrailingSlashGuard]
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./blog-home/blog-post/blog-post.component').then(m => m.BlogPostComponent),
    canActivate: [TrailingSlashGuard]
  },
  
  // Admin Routes - Lazy loaded
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { 
        path: 'posts', 
        loadComponent: () => import('./admin/manage-posts/manage-posts.component').then(m => m.ManagePostsComponent),
        canActivate: [TrailingSlashGuard]
      },
      { 
        path: 'posts/add', 
        loadComponent: () => import('./admin/add-post/add-post.component').then(m => m.AddPostComponent)
      },
      { 
        path: 'posts/edit/:id', 
        loadComponent: () => import('./admin/edit-post/edit-post.component').then(m => m.EditPostComponent)
      },
    ],
  },

  // Legal Routes - Lazy loaded
  { 
    path: 'privacy-policy', 
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  { 
    path: 'terms-of-service', 
    loadComponent: () => import('./terms-of-services/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },

  // Auth Routes - Lazy loaded
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [TrailingSlashGuard]
  },

  // Catch-All Route (404)
  { path: '**', component: PageNotFoundComponent },
];
