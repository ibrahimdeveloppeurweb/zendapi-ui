import { Lot } from '@model/lot';
import { Rental } from '@model/rental';
import { ConstructionAddComponent } from '@agence/chantier/construction/construction-add/construction-add.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '@service/construction/construction.service';
import { FilterService } from '@service/filter/filter.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { OwnerService } from '@service/owner/owner.service';
import { QuoteService } from '@service/quote/quote.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CondominiumAddComponent } from '../condominium-add/condominium-add.component';
import { CondominiumShowItemComponent } from '../condominium-show-item/condominium-show-item.component';
import { HouseService } from '@service/house/house.service';
import { RentalService } from '@service/rental/rental.service';

@Component({
  selector: 'app-condominium-show',
  templateUrl: './condominium-show.component.html',
  styleUrls: ['./condominium-show.component.scss']
})
export class CondominiumShowComponent implements OnInit {

  copropriete: any
  coproprieteType: any
  homes: any
  type: string = 'LOT'
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
  file: any
  structure: any
  lot: any

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
    private ownerService: OwnerService,
    private syndicService: SyndicService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private uploader: UploaderService,
  ) {
    this.structure = this.route.snapshot.params.house
    if(this.structure === 'HOUSE'){
      this.activeTab = 'LOT'
      // this.onChangeLoad(true, 'LOT')
      this.houseService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.lot = res
      })
    }else{
      this.activeTab = 'LOT'
      // this.onChangeLoad(true, 'LOT')
      this.rentalService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.lot = res
      })
    }
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
        if(this.activeTab === 'LOT'){
          return this.homes = res
        } else if(this.activeTab === 'TRAVAUX'){
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
    if(this.activeTab === 'LOT'){
      this.bien = true;
      this.name = false
      this.bienTitle = 'Nom du lot';
      this.categorieTitle = 'Type de lot'
      this.categorie = false
      this.etatRow = [];
      this.categorieRow = [
        { label: 'VERTICAL', value: 'VERTICAL' },
        { label: 'HORIZONTAL', value: 'HORIZONTAL' }
      ];
      this.typeRow = [
        { label: 'LOT', value: 'LOT' },
      ];
      this.homeService.getList(null, this.route.snapshot.params.id, null).subscribe((res: any) => {
        return this.homes = res
      })
    }else if(this.activeTab === 'TRAVAUX'){
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

  getLot(){
    this.coproprieteType = this.coproprieteService.getCopropriete();
    if(this.coproprieteType.type === 'VERTICAL'){
      this.activeTab = 'LOT'
      this.onChangeLoad(true, 'LOT')
      this.coproprieteService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.copropriete = res
      })
      this.homeService.getList(null, this.route.snapshot.params.id, null, null).subscribe((res: any) => {
        return this.homes = res
      })
    } else if(this.coproprieteType.type === 'HORIZONTAL'){
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

  back() {
    if(this.route.snapshot.params.type === 'PROPRIETAIRE'){
      this.router.navigate(['/admin/proprietaire'])
      this.ownerService.return = "PROPRIETAIRE"
    } else if(this.route.snapshot.params.type === 'SYNDIC_LIST'){
      this.router.navigate(['/admin/syndic'])
      this.syndicService.return = "SYNDIC_LIST"
    } else if(this.route.snapshot.params.type === 'SYNDIC_SHOW'){
      this.router.navigate(['/admin/syndic/show/' + this.coproprieteService.uuidSyndic])
      this.syndicService.return = "SYNDIC_SHOW"
    } else if(this.route.snapshot.params.type === 'COPROPRIETAIRE_SHOW'){
      this.router.navigate(['/admin/proprietaire/show/' + this.coproprieteService.uuidSyndic])
      this.ownerService.return = "COPROPRIETAIRE_SHOW"
    }
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
    this.coproprieteService.exit = this.route.snapshot.params.type
    this.coproprieteService.uuidSyndic = this.route.snapshot.params.id
    this.router.navigate(['/admin/proprietaire/copropriete/show/' + row.uuid + '/LOT/item']);
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

  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
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
