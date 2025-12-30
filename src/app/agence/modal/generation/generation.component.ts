import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthService } from '@service/auth/auth.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { GenerationService } from '@service/generation/generation.service';
import { NoticeAddComponent } from '@agence/locataire/notice/notice-add/notice-add.component';

@Component({
  selector: 'app-generation',
  templateUrl: './generation.component.html',
  styleUrls: ['./generation.component.scss']
})
export class GenerationComponent implements OnInit {
  user: any;
  title?: string

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    public modalActive: NgbActiveModal,
    private generationService: GenerationService
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.title = "Génération"
  }

  ngOnInit(): void {
  }

  add(type){
    this.generationService.generate(type).subscribe(res =>{
      if(res){ return res }
    })
  }
  onConfirme(type) {
    let label = null;
    if (type === 'AVIS') {
      label = 'Confirmez-vous la génération des avis d\'écheances ?';
      this.modal(NoticeAddComponent, 'modal-basic-title', 'md', true, 'static')
    } else if (type === 'RENT') {
      label = 'Confirmez-vous la génération des loyers ?';
    } else if(type === 'PENALITY') {
      label = 'Confirmez-vous la génération des pénalités ?';
    }
    if(type !== 'AVIS') {
      Swal.fire({
        title: '',
        text: label,
        icon: 'warning',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
        cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
        confirmButtonColor: '#1bc943',
        reverseButtons: true
      }).then((willDelete) => {
        if (!willDelete.dismiss) {
          this.add(type);
        }
      });
    }
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  onClose(){ this.modalActive.close('ferme'); }
}
