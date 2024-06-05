import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { LoginComponent } from './login/login.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SummaryComponent } from './summary/summary.component';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MessagesModule } from 'primeng/messages';
import { CapitalizePipe } from './shared/capitalize.pipe';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TaskDetailsComponent } from './board/task-details/task-details.component';
import { TaskCardComponent } from './board/task-card/task-card.component';
import { PanelModule } from 'primeng/panel';
import { TaskEditComponent } from './board/task-edit/task-edit.component';
import { TaskFormComponent } from './shared/task-form/task-form.component';





@NgModule({
  declarations: [
    AppComponent,
    AddTaskComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    BoardComponent,
    ContactsComponent,
    SummaryComponent,
    SignUpComponent,
    PageNotFoundComponent,
    LoadingSpinnerComponent,
    CapitalizePipe,
    TaskDetailsComponent,
    TaskCardComponent,
    TaskEditComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    InputTextareaModule,
    FloatLabelModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    ChipsModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    DividerModule,
    TooltipModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    CheckboxModule,
    FormsModule,
    HttpClientModule,
    MessagesModule,
    DragDropModule,
    OverlayPanelModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    PanelModule,
    FormsModule
 
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()) 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
