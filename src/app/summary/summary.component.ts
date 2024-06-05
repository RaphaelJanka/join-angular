import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit{
date!: Date;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    console.log(new Date());
    
    
  }

  checkDate() {
    console.log('Date', this.date);
    
  }
}
