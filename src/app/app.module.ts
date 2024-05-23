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
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { LoginComponent } from './login/login.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SummaryComponent } from './summary/summary.component';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SignUpComponent } from './login/sign-up/sign-up.component';


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
    SignUpComponent
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
    MenuModule,
    DividerModule,
    TooltipModule
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
