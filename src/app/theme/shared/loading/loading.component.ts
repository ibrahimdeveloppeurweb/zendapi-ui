import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmitterService} from '@service/emitter/emitter.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  disallowLoading: boolean = false;
  isLoading: boolean = false;
  text = 'Chargement en cours...';

  constructor(private emitter: EmitterService, private cd: ChangeDetectorRef) {
    this.emitter.on('LOADING_START', (data) => {
      if (this.isLoading) {
        return;
      }
      if (this.disallowLoading) {
        this.disallowLoading = false;
        return;
      }
      this.isLoading = true;
      if (data.payload.hasOwnProperty('text')) {
        if (data.payload.text) {
          this.text = data.payload.text ? data.payload.text : 'Chargement en cours...';
        }
      }
    });
    this.emitter.on('DISALLOW_LOADING', () => {
      this.disallowLoading = true;
    });
    this.emitter.on('LOADING_STOP', (data) => {
      this.isLoading = false;
      this.text = 'Chargement en cours...';
    });
  }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
