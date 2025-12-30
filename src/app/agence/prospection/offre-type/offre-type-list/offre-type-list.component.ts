import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-offre-type-list',
  templateUrl: './offre-type-list.component.html',
  styleUrls: ['./offre-type-list.component.scss']
})
export class OffreTypeListComponent implements OnInit {

  @Input() typeOffres : any[]
  
  constructor() { }

  ngOnInit(): void {
  }

  showTypeOffre(item){}
  editTypeOffre(item){}
  deleteTypeOffre(item){}

}
