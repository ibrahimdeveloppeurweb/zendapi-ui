import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WorksiteService } from '@service/worksite/worksite.service';
import { Worksite } from '@model/worksite';

@Component({
  selector: 'app-outil-gantt',
  templateUrl: './outil-gantt.component.html',
  styleUrls: ['./outil-gantt.component.scss']
})
export class OutilGanttComponent implements OnInit {

  showGantt: boolean = false;
  workSiteUuid: string = "";
  workPlaning: string = "";
  isDisabled: boolean = false;
  hasToBeTrue: boolean = true;
  type: string = "";
  worksites: Worksite[] = [];

  constructor(
    private route: ActivatedRoute,
    public _location: Location,
    private worksiteService: WorksiteService,
  ) {
    this.type = this.route.snapshot.params.type
    
    if (this.type === "DQ") {
      this.workSiteUuid = this.route.snapshot.params.id
    }

    if (this.type === "PLANNING" || this.type === "EDIT" || this.type === "SHOW") {
      this.workPlaning = this.route.snapshot.params.id
    }

    if (this.workSiteUuid !== "" && this.type !== "") {      
      this.showGantt = true;
    }

    if (this.workPlaning !== "" && this.type !== "") {
      this.showGantt = true;
    }
  }

  ngOnInit() {}

  back(){
    this._location.back();
  }

}
