import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogHomeComponent } from './blog/home/home.component';
import { StayTunedComponent } from './homepage/stay-tuned/stay-tuned.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./homepage/stay-tuned/stay-tuned.module').then(
        (m) => m.StayTunedModule
      ),
    component: StayTunedComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
    component: BlogHomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'blog/home',
    redirectTo: 'blog',
  },
  {
    path: 'portfolio',
    loadChildren: () =>
      import('./portfolio/portfolio.module').then((m) => m.PortfolioModule),
    component: PortfolioComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
