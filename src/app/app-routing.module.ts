import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SummaryComponent } from './summary/summary.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { authGuard } from './login/auth.guard';
import { TaskDetailsComponent } from './board/task-details/task-details.component';
import { TaskEditComponent } from './board/task-edit/task-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [authGuard] },
  { path: 'addTask', component: AddTaskComponent, canActivate: [authGuard] },
  {
    path: 'board',
    component: BoardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: ':id',
        component: TaskDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: ':id/edit',
        component: TaskEditComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
