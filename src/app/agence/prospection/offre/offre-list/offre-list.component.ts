import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OffreService } from '@service/offre/offre.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
 
@Component({
  selector: 'app-offre-list',
  templateUrl: './offre-list.component.html',
  styleUrls: ['./offre-list.component.scss']
})
export class OffreListComponent implements OnInit {

  @Input() offres: any[]
  @Input() etat: boolean = true
  publicUrl = environment.publicUrl
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  typeList: string = 'liste'
  offresList: any

  constructor(
    public router: Router,
    private emitter: EmitterService,
    public config: NgbCarouselConfig,
    private offreService: OffreService,
  ) {
    this.config.interval = 1000;
		this.config.wrap = false;
		this.config.keyboard = false;
		this.config.pauseOnHover = false;
  }

  ngOnInit(): void {
    if (this.offres) {
      this.offresList = [...this.offres]; 
    }
    console.log("this.offres",this.offresList);   
    console.log("this.offres",this.offres);   
  }

  showOffre(item){
    this.offreService.setOffre(item);
    this.router.navigate(['/admin/prospection/offre/show/' + item?.list?.uuid]);
  }
  publier(item){
    Swal.fire({
      title: '',
      text: "Confirmez-vous la publication de l'offre?",
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.emitter.loading();
        const data ={uuid:item.uuid}
        this.offreService.publier(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.emitter.emit({ action: 'OFFRE_EDIT', payload: res?.data });
            }
            this.emitter.stopLoading();
          },
          error => { });
      }
    });

  }
  editOffre(item){}

  printerOffre(row){
    // console.log(row)
    this.offreService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.list.uuid);
  }

  onSelectList(list){
    if(list == true) {
      this.offreService.getList().subscribe((res: any) => {
          this.offres = res.filter(item => {
                return item.list?.vedette == true; 
            });
            console.log('item',this.offres);
      })      
    }else { 
      this.offreService.getList().subscribe((res: any) => {
        this.offres = res
    })
    }
  }

  deleteOffre(item){
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
        this.offreService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.offres.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.offres.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
          }
        });
      }
    });

  }
  

  addVedette(item,type) {   
    Swal.fire({
      title: '',
      text: type ? 'Voulez-vous vraiment mettre cette offre en vedette ?' : 'Voulez-vous vraiment rettirer cette offre en vedette ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        const formData = { offre: item.list.uuid, type: type };
        this.offreService.vedette(formData).subscribe(res => {
          if (res?.code === 200) {
              this.offreService.getList().subscribe((res: any) => {
                return this.offres = res
              })
              Swal.fire('Succès', 'Opération reussi avec succès', 'success');
          }
        }, error => {
          Swal.fire('', error.error?.message, 'error');
        })
      }
    });
  }
}
