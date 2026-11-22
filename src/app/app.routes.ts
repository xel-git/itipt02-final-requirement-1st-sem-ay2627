import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
 
  {
    path: 'completed',
    loadComponent: () => import('./pages/completed/completed.page').then((m) => m.CompletedPage),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks.page').then((m) => m.TasksPage),
  },
];
