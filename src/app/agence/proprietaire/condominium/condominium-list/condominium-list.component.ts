import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CondominiumAddComponent } from '../condominium-add/condominium-add.component';
import { HomeCoService } from '@service/syndic/home-co.service';
import { SyndicService } from '@service/syndic/syndic.service';

@Component({
  selector: 'app-condominium-list',
  templateUrl: './condominium-list.component.html',
  styleUrls: ['./condominium-list.component.scss']
})
export class CondominiumListComponent implements OnInit {


  @Input() coproprietes: any[] =[]
  dtOptions = {}
  publicUrl = environment.publicUrl;
  userSession = Globals.user

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private coproprieteService: CoproprieteService,
    private homeService: HomeCoService,
    private syndicService: SyndicService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  showHouse(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.exit = 'PROPRIETAIRE'
    this.router.navigate(['/admin/proprietaire/copropriete/show/' + row.uuid + '/PROPRIETAIRE']);
  }

  editHouse(row){
    this.coproprieteService.setCopropriete(row)
    console.log('lot currentBudget', row?.trustee?.currentBudget);
    this.coproprieteService.edit = true
    this.syndicService.setCurrentBudget(row?.trustee?.currentBudget);
    this.modal(CondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printHouse(row){
    if (row.type === 'VERTICAL') {
      this.coproprieteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
    else if (row.type === 'HORIZONTAL') {
      this.homeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.coproprieteService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.coproprietes.findIndex(x => x.id === item.id);
            if (index !== -1) { this.coproprietes.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
      if(result == 'COPROPRIETE'){
        this.homeService.getList(null, null, null, null).subscribe((res: any) => {
          return this.coproprietes = res
        })
      }
    }, (reason) => { });
  }


}
