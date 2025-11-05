import { Routes } from '@angular/router';
import { TrailingSlashGuard } from './guards/trailing-slash.guard';
import { AuthGuard } from './guards/admin/auth.guard';
import { createApolloProvider } from './config/apollo.config';

export const routes: Routes = [
  // Public Routes - Lazy loaded for better initial bundle size
  { 
    path: '', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
  },
  { 
    path: 'resume', 
    loadComponent: () => import('./resume/resume.component').then(m => m.ResumeComponent),
    providers: [createApolloProvider()]
  },
  
  // Secret Terminal Route - Lazy loaded
  { 
    path: 'terminal', 
    loadComponent: () => import('./components/interactive-terminal/interactive-terminal.component').then(m => m.InteractiveTerminalComponent)
  },
  
  // Blog Routes - Lazy loaded
  { 
    path: 'blog', 
    loadComponent: () => import('./blog-home/blog-home.component').then(m => m.BlogHomeComponent),
    canActivate: [TrailingSlashGuard],
    providers: [createApolloProvider()]
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./blog-home/blog-post/blog-post.component').then(m => m.BlogPostComponent),
    canActivate: [TrailingSlashGuard],
    providers: [createApolloProvider()]
  },
  
  // Admin Routes - Lazy loaded
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard],
    providers: [createApolloProvider()],
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

  // Catch-All Route (404) - Lazy loaded
  { 
    path: '**', 
    loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
];
