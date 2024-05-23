import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SummaryComponent } from './summary/summary.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'addTask', component: AddTaskComponent },
  { path: 'board', component: BoardComponent },
  { path: 'contacts', component: ContactsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
