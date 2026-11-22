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
    path: 'alltasks',
    loadComponent: () => import('./pages/alltasks/alltasks.page').then((m) => m.AlltasksPage),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks.page').then((m) => m.TasksPage),
  },
  {
    path: 'alltasks',
    loadComponent: () => import('./pages/alltasks/alltasks.page').then((m) => m.AlltasksPage),
  },
];
