import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { UploaderService } from '@service/uploader/uploader.service';

@Component({
  selector: 'app-infrastructure-show',
  templateUrl: './infrastructure-show.component.html',
  styleUrls: ['./infrastructure-show.component.scss']
})
export class InfrastructureShowComponent implements OnInit {

  infrastructure: any
  title: string = ''
  file: any
  publicUrl = environment.publicUrl;

  constructor(    
    public modal: NgbActiveModal,
    private uploader: UploaderService,
    private infrastructureService : InfrastructureService
  ) { 
    this.infrastructure = this.infrastructureService.getInfrastructure()
    const code = this.infrastructure ? this.infrastructure.code : ''
    this.title = 'Détail de l\'infrastructure ' + code
  }

  ngOnInit(): void {
  }


  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

  onClose(){
    this.modal.close('ferme');
  }

}
