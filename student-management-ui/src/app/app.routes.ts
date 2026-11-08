import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - FutureTech Student Management'
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/students/student-list/student-list.component').then(m => m.StudentListComponent),
        title: 'Student Directory - FutureTech'
      },
      {
        path: 'students/create',
        loadComponent: () =>
          import('./features/students/student-create/student-create.component').then(m => m.StudentCreateComponent),
        title: 'Register Student - FutureTech'
      },
      {
        path: 'students/:id',
        loadComponent: () =>
          import('./features/students/student-details/student-details.component').then(m => m.StudentDetailsComponent),
        title: 'Student Details - FutureTech'
      },
      {
        path: 'students/:id/edit',
        loadComponent: () =>
          import('./features/students/student-edit/student-edit.component').then(m => m.StudentEditComponent),
        title: 'Edit Student - FutureTech'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
