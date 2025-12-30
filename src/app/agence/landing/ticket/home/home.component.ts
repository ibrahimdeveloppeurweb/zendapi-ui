import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }


  onTicket(){
    // this.router.navigate(['/landing/ticket/create/' + item.uuid]);
    this.router.navigate(['/landing/ticket/create/']);
  }

  onInfo(){
    // this.router.navigate(['/landing/ticket/historique/' + item.uuid]);
    this.router.navigate(['/landing/ticket/historique/']);
  }
}
