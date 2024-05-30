import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../login/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = false;
  authUserSubscription!: Subscription;
  authUser!: User | null;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authUserSubscription = this.authService.authenticatedUser.subscribe((user: User | null) => {
      this.authUser = user;
      console.log(this.authUser);
    })
  }


  onLogOut() {
    this.authService.logOut();
  }


  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
  }
}
