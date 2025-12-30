import {Component, Inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Spinkit} from './spinkits';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {EmitterService} from '@service/emitter/emitter.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: [
    './spinner.component.scss',
    './spinkit-css/sk-line-material.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;
  public Spinkit = Spinkit;
  @Input() public backgroundColor = '#2196f3';
  @Input() public spinner = Spinkit.skLine;

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document,
              private emitter: EmitterService) {
    this.emitter.on('LOADING', (data) => {
      if (data.payload === 'START') {
        this.loading();
      }
      if (data.payload === 'STOP') {
        this.stop();
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isSpinnerVisible = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isSpinnerVisible = false;
      }
    }, () => {
      this.isSpinnerVisible = false;
    });
  }

  loading() {
    this.isSpinnerVisible = true;
  }

  stop() {
    this.isSpinnerVisible = false;
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
