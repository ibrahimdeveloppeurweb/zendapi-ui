import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-syndic-mandate-show',
  templateUrl: './syndic-mandate-show.component.html',
  styleUrls: ['./syndic-mandate-show.component.scss']
})
export class SyndicMandateShowComponent implements OnInit {

  mandat: any
  title: string = ''
  userSession = Globals.user
  constructor(
    public modal: NgbActiveModal,
    private mandateService : MandateSyndicService,
    private emitter: EmitterService
  ) {
    this.mandat = this.mandateService.getMandat()
    const code = this.mandat ? this.mandat.code : ''
    this.title = 'Détail du mandat ' + code
    console.log(this.mandat)

    
  }

  ngOnInit(): void {
  }

  onClose(){
    this.modal.close('ferme');
  }

  printMandate(item){
    this.mandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, item?.trustee?.uuid, item.uuid);
  }

  onValidate() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous valider ce mandat ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.mandateService.validate(this.mandat.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.emitter.emit({ action: 'MANDAT_SYNDIC_UPDATED', payload: res?.data });
            this.modal.close('ferme');
          }
        })
      }
    });
  }

}
