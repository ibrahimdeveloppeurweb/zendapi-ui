import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-droit',
  templateUrl: './no-droit.component.html',
  styleUrls: ['./no-droit.component.scss']
})
export class NoDroitComponent implements OnInit {
  @Input() title: string = ""

  constructor() { }

  ngOnInit(): void {
  }
}
