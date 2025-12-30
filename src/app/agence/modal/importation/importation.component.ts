import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LotService } from '@service/lot/lot.service';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { HomeService } from '@service/home/home.service';
import { RentService } from '@service/rent/rent.service';
import { HouseService } from '@service/house/house.service';
import { IsletService } from '@service/islet/islet.service';
import { OwnerService } from '@service/owner/owner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RentalService } from '@service/rental/rental.service';
import { TenantService } from '@service/tenant/tenant.service';
import { SupplyService } from '@service/supply/supply.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProductService } from '@service/product/product.service';
import { PaymentService } from '@service/payment/payment.service';
import { ProviderService } from '@service/provider/provider.service';
import { CustomerService } from '@service/customer/customer.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { ConstructionService } from '@service/construction/construction.service';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';

@Component({
  selector: 'app-importation',
  templateUrl: './importation.component.html',
  styleUrls: ['./importation.component.scss']
})
export class ImportationComponent implements OnInit {
  title?: string
  showButton : boolean
  @Input() public type;
  form: FormGroup;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })
  selectFile: File = null

  constructor(
    public modal: NgbActiveModal,
    private lotService: LotService,
    private emitter: EmitterService,
    private rentService: RentService,
    private homeService: HomeService,
    private houseService: HouseService,
    private ownerService: OwnerService,
    private isletService: IsletService,
    private rentalService: RentalService,
    private tenantService: TenantService,
    private supplyService: SupplyService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private customerService: CustomerService,
    private providerService: ProviderService,
    private treasuryService: TreasuryService,
    private homeTypeService: HomeTypeService,
    private promotionService: PromotionService,
    private fundRequestService: FundRequestService,
    private subdivisionService: SubdivisionService,
    private constructionService: ConstructionService,
    private paymentCustomerService: PaymentCustomerService
  ) {
    this.title = "Importation de fichier excel"
  }

  ngOnInit(): void {
    this.showButton = true
  }

  onFileChangeOne(event) {
    let file = event.target.files;
    if (file && file[0]) {
      let filename = file[0].name;
      if (filename.lastIndexOf(".xls") <= 0) {
        return this.Toast.fire({
              icon: 'info',
              title: 'Importation: ',
              text: 'Veuillez selectionner un fichier excel au format (.xls)'
            })
      }
      if (file[0].size > 1048576) {
        return this.Toast.fire({
              icon: 'info',
              title: 'Importation: ',
              text: 'Veuillez selectionner un fichier dont la taille est inférieure à 2 Mo'
            })
      }
      this.showButton = false
      this.selectFile =  <File>file[0]
    }
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('file', this.selectFile, this.selectFile.name);
    if(this.type === 'LOCATAIRE'){
      this.tenantService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'LOT') {
      this.lotService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'ILOT') {
      this.isletService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'BIEN') {
      this.houseService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'LOYER') {
      this.rentService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'CLIENT') {
      this.customerService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'MAISON') {
      this.homeService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'DEMANDE') {
      this.fundRequestService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PRODUIT') {
      this.productService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'LOCATIVE') {
      this.rentalService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PAIEMENT') {
      this.paymentService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'HOMETYPE') {
      this.homeTypeService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PROMOTION') {
      this.promotionService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'TRESORERIE') {
      this.treasuryService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'LOTISSEMENT') {
      this.subdivisionService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PRESTATAIRE') {
      this.providerService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PROPRIETAIRE') {
      this.ownerService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'INTERVENTION') {
      this.constructionService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'PAIEMENT_CUSTOMER') {
      this.paymentCustomerService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    } else if(this.type === 'APPROVISIONNEMENT') {
      this.supplyService.import(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
        }
        this.emitter.stopLoading();
      },
      error => { });
    }
  }
  onClose(){
    this.modal.close('ferme');
  }
}
