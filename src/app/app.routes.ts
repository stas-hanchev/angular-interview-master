import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'categories/:categoryId',
    loadComponent: () =>
      import('./components/category/category.component').then(
        (m) => m.CategoryComponent
      ),
  },
  {
    path: 'preparation',
    loadComponent: () =>
      import('./components/preparation/preparation.component').then(
        (m) => m.PreparationComponent
      ),
  },
  { path: '', redirectTo: '/categories/angular', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
