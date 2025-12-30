import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeCoService } from '@service/syndic/home-co.service';
import { ConstructionAddComponent } from '@agence/chantier/construction/construction-add/construction-add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '@service/construction/construction.service';
import { FilterService } from '@service/filter/filter.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { QuoteService } from '@service/quote/quote.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CondominiumAddComponent } from '../condominium-add/condominium-add.component';
import { SyndicService } from '@service/syndic/syndic.service';

@Component({
  selector: 'app-condominium-show-item',
  templateUrl: './condominium-show-item.component.html',
  styleUrls: ['./condominium-show-item.component.scss']
})
export class CondominiumShowItemComponent implements OnInit {

  copropriete: any
  coproprieteType: any
  homes: any
  type: string = 'TRAVAUX'
  activeTab: string;
  publicUrl = environment.publicUrl;
  dtOptions: any = {}
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;

  filter: any;
  action: boolean = true;
  etat: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  etatRow = [
    { label: 'APPARTEMENT', value: 'APPARTEMENT' },
    { label: 'PALIER', value: 'PALIER' },
    { label: 'MAGASIN', value: 'MAGASIN' },
    { label: 'BUREAU', value: 'BUREAU' },
    { label: 'SURFACE', value: 'SURFACE' },
    { label: 'RESTAURANT', value: 'RESTAURANT' },
    { label: 'HALL', value: 'HALL' },
    { label: 'SALLE CONFERENCE', value: 'SALLE CONFERENCE' },
    { label: 'PARKING', value: 'PARKING' }
  ]
  typeRow = [
    { label: 'LOT', value: 'LOT' },
  ];
  nameTitle: string = "Numéro de lot"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = ""
  etatTitle: string = "Type"
  bien: boolean = true
  bienTitle: string = 'Numéro de porte'
  categorieRow = [];
  view: boolean = true
  quotes: any[]
  invoiceCos: any[]
  interventions: any[]
  modelRef: NgbModalRef
  nbBien: number = 0
  nbTravaux: number = 0
  nbFacture: number = 0
  nbDevis: number = 0
  categorie: Boolean = false
  name:boolean = false

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private homeService: HomeCoService,
    private quoteService: QuoteService,
    private filterService: FilterService,
    private invoiceCoService: InvoiceCoService,
    private constructionService: ConstructionService,
    private coproprieteService: CoproprieteService,
    private synidcService: SyndicService
  ) {
    this.coproprieteType = this.coproprieteService.getCopropriete();
   if(this.coproprieteType.type === 'HORIZONTAL'){
      this.activeTab = 'TRAVAUX'
      this.onChangeLoad(true, 'TRAVAUX')
      this.homeService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.copropriete = res
      })
      this.constructionService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
        return this.interventions = res
      })
    } else if(this.coproprieteType.type !== 'VERTICAL' && this.coproprieteType.type !== 'HORIZONTAL' ){
      this.activeTab = 'TRAVAUX'
      this.onChangeLoad(true, 'TRAVAUX') 
      this.homeService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.copropriete = res
      })
      this.constructionService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
        return this.interventions = res
      })
    }
    this.onChangeLength()
   }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  onFilter($event){
    this.homes = []
    this.interventions = []
    this.invoiceCos = []
    this.quotes = []
    $event.uuid = this.copropriete?.uuid
    $event.syndic = this.copropriete?.trustee?.uuid
    this.filterService.search($event, 'trustee', this.copropriete.uuid).subscribe(
      res => {
         if(this.activeTab === 'TRAVAUX'){
          return this.interventions = res
        } else if(this.activeTab === 'FACTURE'){
          return this.invoiceCos = res
        } else if(this.activeTab === 'DEVIS'){
          return this.quotes = res
        }
      }, err => { })
  }

  onChangeLoad(bool: boolean, type: string){
    this.view = bool
    this.activeTab = type
    if(this.activeTab === 'TRAVAUX'){
      this.bien = false
      this.nameTitle = 'Libellé intervention'
      this.etat = false
      this.typeRow = [
        { label: 'INTERVENTION', value: 'INTERVENTION' },
      ];
      if(this.coproprieteType.type === 'VERTICAL'){
        this.constructionService.getList(null, null, this.route.snapshot.params.id, null).subscribe((res: any) => {
          return this.interventions = res
        })
      }else if(this.coproprieteType.type !== 'VERTICAL'){
        this.constructionService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
          return this.interventions = res
        })
      }
    }else if(this.activeTab === 'FACTURE'){
      this.bien = false
      this.nameTitle = 'Libellé facture'
      this.etat = false
      this.typeRow = [
        { label: 'FACTURE', value: 'FACTURE' },
      ];
      if(this.coproprieteType.type === 'VERTICAL'){
        this.invoiceCoService.getList(null, null, null, this.route.snapshot.params.id, null).subscribe((res: any) => {
          return this.invoiceCos = res
        })
      }else if(this.coproprieteType.type !== 'VERTICAL'){
        this.invoiceCoService.getList(null, null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
          return this.invoiceCos = res
        })
      }
    }else if(this.activeTab === 'DEVIS'){
      this.bien = false
      this.nameTitle = 'Libellé devis'
      this.etat = false
      this.typeRow = [
        { label: 'DEVIS', value: 'DEVIS' },
      ];
      if(this.coproprieteType.type === 'VERTICAL'){
        this.quoteService.getList(null, null, null, 0, this.route.snapshot.params.id, null).subscribe((res: any) => {
          return this.quotes = res
        })
      }else if(this.coproprieteType.type !== 'VERTICAL'){
        this.quoteService.getList(null, null, null, 0, null, this.route.snapshot.params.id).subscribe((res: any) => {
          return this.quotes = res
        })
      }
    }
  }

  back() {
    this.router.navigate(['/admin/proprietaire/copropriete/show/' +this.coproprieteService.uuidSyndic+ '/' +this.coproprieteService.exit])
    this.synidcService.getSingle(this.coproprieteService.uuidSyndic).subscribe((res: any) => {
      return this.synidcService.setSyndic(res)
    })
    this.coproprieteService.exit = 'VERTICAL'
    this.coproprieteService.uuidSyndic = null
  }

  onChangeLength(){
    this.homeService.getList(null, this.route.snapshot.params.id, null, null).subscribe((res: any) => {
      return this.nbBien = res.length
    })
    if(this.coproprieteType.type === 'VERTICAL'){
      this.constructionService.getList(null, null, this.route.snapshot.params.id, null).subscribe((res: any) => {
        return this.nbTravaux = res.length
      })
    }else if(this.coproprieteType.type === 'HORIZONTAL'){
      this.constructionService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
        return this.nbTravaux = res.length
      })
    }
    if(this.coproprieteType.type === 'VERTICAL'){
      this.invoiceCoService.getList(null, null, null, this.route.snapshot.params.id, null).subscribe((res: any) => {
        return this.nbFacture = res.length
      })
    }else if(this.coproprieteType.type === 'HORIZONTAL'){
      this.invoiceCoService.getList(null, null, null, null, this.route.snapshot.params.id).subscribe((res: any) => {
        return this.nbFacture = res.length
      })
    }
    if(this.coproprieteType.type === 'VERTICAL'){
      this.quoteService.getList(null, null, null, 0, this.route.snapshot.params.id, null).subscribe((res: any) => {
        return this.nbDevis = res.length
      })
    }else if(this.coproprieteType.type === 'HORIZONTAL'){
      this.quoteService.getList(null, null, null, 0, null, this.route.snapshot.params.id).subscribe((res: any) => {
        return this.nbDevis = res.length
      })
    }
  }

  showConstruction(row) {
    this.constructionService.setConstruction(row);
    this.router.navigate(['/admin/intervention/show/' + row.uuid]);
  }

  printerConstruction(row): void {
    this.constructionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  
  editConstruction(row) {
    this.constructionService.setConstruction(row);
    this.constructionService.edit = true;
    this.constructionService.type = row.type;
    this.modal(ConstructionAddComponent, 'modal-basic-title', 'lg', true, 'static');
    this.modelRef.componentInstance.type = this.constructionService.type == "SYNDIC"?  "SYNDIC":"LOCATIVE"
  }

  showhouseItem(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.exit = 'PROPRIETAIRE'
    this.router.navigate(['/admin/proprietaire/copropriete/show/' + row.uuid + '/PROPRIETAIRE/item']);
  }

  deleteConstruction(construction) {
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
        this.constructionService.getDelete(construction.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.interventions.findIndex(x => x.uuid === construction.uuid);
            if (index !== -1) {
              this.interventions.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }

  editHouse(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.edit = true
    this.modal(CondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printHouse(row){
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
           this.router.navigate(['/admin/proprietaire'])
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
    }, (reason) => { });
  }

}
