import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadChildren: () => import('./modules/task/task.module')
      .then(m => m.TaskModule)
  },
  { 
    path: '', 
    redirectTo: 'tasks', 
    pathMatch: 'full' 
  }
];
