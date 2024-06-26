import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'join';
  isHeaderVisible: boolean = true;
  routerSubscription!: Subscription;

  constructor(private primengConfig: PrimeNGConfig, public router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.isHeaderVisible = !(
          currentRoute.includes('login') || currentRoute.includes('signup')
        );
      });
      this.authService.autoLogin();
  }
  

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
