import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournauxService } from '@service/configuration/journaux.service';
import { Globals } from '@theme/utils/globals';
import { JournauxAddComponent } from '../journaux-add/journaux-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-journaux-list',
  templateUrl: './journaux-list.component.html',
  styleUrls: ['./journaux-list.component.scss']
})
export class JournauxListComponent implements OnInit {

  form: FormGroup;
  visibleAjout = false
  visibleButton = true
  visibleTable = true
  dtOptions: any = {};
  submit = true
  // journaux: any[] = []
  agency = Globals.user.agencyKey
  currentSyndic: any
  journaux: any[] = []


  Natures = [
    {label: 'Opérations diverses' , value: 'OPERATION DIVERSES'},
    {label: 'Ventes' , value: 'VENTE'},
    {label: 'Achats' , value: 'ACHAT'},
    {label: 'Banque' , value: 'BANQUE'},
    {label: 'Notes de frais' , value: 'NOTE_FRAIS'},
    {label: 'Inventaire' , value: 'INVENTAIRE'},
    {label: 'A-nouveaux' , value: 'A_NAOUVEAU'},
  ]

  constructor(
    private modalService: NgbModal,
    private journauxService : JournauxService
  ) { 
    this.journauxService.getList().subscribe((res: any) => {
      this.journaux = res
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  add(){
    this.journauxService.edit = false
    this.modal(JournauxAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  edit(item){
    this.journauxService.setJournaux(item)
    this.journauxService.edit = true
    this.modal(JournauxAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: '<i class="fas fa-trash-alt"></i> Supprimer',
      confirmButtonColor: '#d33',
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.journauxService.getDelete(item.uuid).subscribe((res: any) => {
          if (res.status === 'success') {
            const index = this.journaux.findIndex((x) => {
              return x.uuid === item.uuid;
            });
            if (index !== -1) {
              this.journaux.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  onChange(item){
    this.journauxService.getEtat(item.uuid).subscribe((res: any) => {
      console.log(res)
    })
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { 
      if(result == 'ferme'){
        this.journauxService.getList().subscribe((res: any) => {
          this.journaux = res
        })
      }
    }, (reason) => { });
  }

}
