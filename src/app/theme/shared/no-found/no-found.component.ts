import { AuthService } from '@service/auth/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-found',
  templateUrl: './no-found.component.html',
  styleUrls: ['./no-found.component.scss']
})
export class NoFoundComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  )
  { }

  ngOnInit() {
  }

  back() {
    this.auth.removeDataToken();
    this.auth.removePermissionToken();
    this.router.navigate(['/auth/login']);
  }
}
