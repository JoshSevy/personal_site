import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StayTunedComponent } from './homepage/stay-tuned/stay-tuned.component';

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
