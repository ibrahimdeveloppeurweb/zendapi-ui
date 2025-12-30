import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OwnerService} from '@service/owner/owner.service';
import {DashViewerService} from '@service/dash-viewer/dash-viewer.service';
import { OwnerAddComponent } from '@proprietaire/owner/owner-add/owner-add.component';
import {TenantAddComponent} from "@locataire/tenant/tenant-add/tenant-add.component";
import {TenantService} from "@service/tenant/tenant.service";
import {CustomerService} from "@service/customer/customer.service";
import {RentalService} from "@service/rental/rental.service";
import { RentalAddComponent } from '@agence/proprietaire/rental/rental-add/rental-add.component';
import { CustomerAddComponent } from '@agence/client/customer/customer-add/customer-add.component';
import {ContractService} from "@service/contract/contract.service";
import {MandateService} from "@service/mandate/mandate.service";
import {HouseService} from "@service/house/house.service";
import {TicketService} from "@service/ticket/ticket.service";
import {ConstructionService} from "@service/construction/construction.service";
import {ProviderService} from "@service/provider/provider.service";
import {InvoiceService} from "@service/invoice/invoice.service";
import {ContractShowComponent} from "@locataire/contract/contract-show/contract-show.component";
import {ContractAddComponent} from "@locataire/contract/contract-add/contract-add.component";
import {SyndicMandateShowComponent} from "@agence/syndic/syndic-mandate/syndic-mandate-show/syndic-mandate-show.component";
import {SyndicMandateAddComponent} from "@agence/syndic/syndic-mandate/syndic-mandate-add/syndic-mandate-add.component";
import {HouseAddComponent} from "@proprietaire/house/house-add/house-add.component";
import {ConstructionAddComponent} from "@chantier/construction/construction-add/construction-add.component";
import { Ticket } from '@model/ticket';
import { Ressource } from '@model/ressource';
import { FilterService } from '@service/filter/filter.service';
import { WalletService } from '@service/wallet/wallet.service';
import { CONFIRMATION, PAYMENT, VALIDATION } from '@theme/utils/functions';
import { DateHelperService } from '@theme/utils/date-helper.service';

@Component({
  selector: 'app-dash-viewer',
  templateUrl: './dash-viewer.component.html',
  styleUrls: ['./dash-viewer.component.scss']
})
export class DashViewerComponent implements OnInit {
  title = null;
  entity = null;
  form = null;
  datas: any[] = [];
  tabsL: any[] = [];
  tabsV: any[] = [];
  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  modelRef: NgbModalRef;
  tickets: Ticket[] = [];
  ressource: Ressource[] = [];
  widget : any
  array : any[]
  wallets : any[]
  type: string = 'TOUT';
  event = null;
  dataForm = null;
  uuid = null;
  activeTab = ''
  @Input() id!: number;
  @Input() typeWidget : string; // Reçoit l'ID du tableau à afficher
  activeColumn: string;
  chiffreA = null;
  marge = null;
  coutC = null;
  chiffreR = null;
  total = 0
  validation = VALIDATION
  PAYMENT = PAYMENT
  confirmation = CONFIRMATION
  constructor(
    public router: Router,
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    public bienService: HouseService,
    public ownerService: OwnerService,
    public filterSevice: FilterService,
    public ticketService: TicketService,
    public tenantService: TenantService,
    public rentalService: RentalService,
    public filterService: FilterService,
    public mandatService: MandateService,
    public invoiceService: InvoiceService,
    public viewerSevice: DashViewerService,
    public walletService: WalletService,
    public contratService: ContractService,
    public providerService: ProviderService,
    public customerService: CustomerService,
    public constructionService: ConstructionService
  ) {
    this.title = this.viewerSevice.title;
    this.entity = this.viewerSevice.entity;
    this.uuid = this.viewerSevice.uuid;
    this.tabsL = this.viewerSevice.tabsLibelle;
    this.tabsV = this.viewerSevice.tabsValue;
    if (this.tabsL.length > 0) {
      this.activeTab = this.entity+ '-'+this.tabsL[0]
    }
    this.dataForm = this.filterSevice.getFormData();
    this.chiffreA = this.viewerSevice.chiffreA;
    this.marge = this.viewerSevice.marge;
    this.coutC = this.viewerSevice.coutC;
    this.chiffreR = this.viewerSevice.chiffreR;
    this.loadData();
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  loadData(): void {
    this.array = []
    this.wallets = []
    this.dataForm.value = this.viewerSevice.value;
    if (
      this.entity && this.entity === 'SOLDE_AGENCY' || this.entity && this.entity === 'COMMISSION_LOYER' || this.entity && this.entity === 'CAUTION_AGENCY' ||
      this.entity && this.entity === 'TVA_COMMISSION_AGENCY' || this.entity && this.entity === 'DEPENSE_AGENCY' || this.entity && this.entity === 'CIE_SODECI_AGENCY' ||
      this.entity && this.entity === 'HONORAIRE_AGENCE_AGENCY' || this.entity && this.entity === 'TIMBRES_FISCAUX_AGENCY' || this.entity && this.entity === 'DROIT_ENREGISTREMENT_AGENCY' ||
      this.entity && this.entity === 'FRAIS_DOSSIER_AGENCY' || this.entity && this.entity === 'FRAIS_ASSURANCE_AGENCY' || this.entity && this.entity === 'AUTRE_AGENCY' ||
      this.entity && this.entity === 'SOLDE_OWNER' || this.entity && this.entity === 'LOYER' || this.entity && this.entity === 'CAUTION_OWNER' || this.entity == 'COMMISSION_OWNER'
    ){
      this.dataForm.type = this.entity;
      this.filterService.viewer(this.dataForm, 'wallet', this.uuid).subscribe(
        res => {
          this.wallets = res
          return this.wallets
        }, err => { })

    }else if(this.entity && this.entity === 'DASH_OWNER'){
      this.dataForm.type = this.activeTab;
      this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
        res => {
          this.array = res
          console.log(this.array)
          return this.array
        }, err => { })
    }else if(this.entity && this.entity === 'DASH_TENANT'){
      this.dataForm.type = this.activeTab;
      this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
        res => {
          this.array = res
          console.log(this.array)
          return this.array
        }, err => { })

    }else if(this.entity && this.entity === 'DASH_CONTRACT'){
      this.dataForm.type = this.activeTab;
      this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
        res => {
          this.array = res
          console.log(this.array)
          return this.array
        }, err => { })

      }else if(this.entity && this.entity === 'DASH_MANDAT'){
        this.dataForm.type = this.activeTab;
        this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
          res => {
            this.array = res
            console.log(this.array)
            return this.array
          }, err => { })

        }else if(this.entity && this.entity === 'DASH_CUSTOMER'){
          this.dataForm.type = this.activeTab;
          this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
            res => {
              this.array = res
              console.log(this.array)
              return this.array
            }, err => { })


          }else if(this.entity && this.entity === 'DASH_LOCATIVE'){
            this.dataForm.type = this.activeTab;
            this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
              res => {
                this.array = res
                console.log(this.array)
                return this.array
              }, err => { })

            }else if(this.entity && this.entity === 'DASH_TICKET'){
              this.dataForm.type = this.activeTab;
              this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                res => {
                  this.array = res
                  console.log(this.array)
                  return this.array
                }, err => { })

        }else if(this.entity && this.entity === 'DASH_IMMOBILIER'){
            this.dataForm.type = this.activeTab;
            this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
              res => {
                this.array = res
                console.log(this.array)
                return this.array
              }, err => { })

            }else if(this.entity && this.entity === 'DASH_INTERVENTION'){
                this.dataForm.type = this.activeTab;
                this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                  res => {
                    this.array = res
                    console.log(this.array)
                    return this.array
                  }, err => { })

              }else if(this.entity && this.entity === 'DASH_FOURNISSEUR'){
                this.dataForm.type = this.activeTab;
                this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                  res => {
                    this.array = res
                    console.log(this.array)
                    return this.array
                  }, err => { })

                }else if(this.entity && this.entity === 'DASH_REPAYMENT'){
                  this.dataForm.type = this.activeTab;
                  this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                    res => {
                      this.array = res
                      console.log(this.array)
                      return this.array
                    }, err => { })

                }else if(this.entity && this.entity === 'DASH_PAYMENT'){
                    this.dataForm.type = this.activeTab;
                    this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                      res => {
                        this.array = res
                        console.log(this.array)
                        return this.array
                      }, err => { })

              }else if(this.entity && this.entity === 'DASH_FACTURE'){
                this.dataForm.type = this.activeTab;
                this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                  res => {
                    this.array = res

                    return this.array
                  }, err => { })

                }else if(this.entity && this.entity === 'DASH_PROMOTION'){
                  this.dataForm.type = this.activeTab;
                  if (this.chiffreA || this.marge || this.coutC || this.chiffreR  ) {
                    this.dataForm.type = "DASH_PROMOTION-Montant";
                  }
                  this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                    res => {
                      this.array = res
                      this.total = 0
                      res.forEach(item => {
                        if (this.chiffreA != null) {
                          this.total = this.total + item?.montantCa
                        }
                        if (this.marge != null) {
                          this.total = this.total + item?.montantMarge
                        }
                        if (this.chiffreR != null) {
                          this.total = this.total + item?.montantCr
                        }
                        if (this.coutC != null) {
                          this.total = this.total + item?.montantCc
                        }


                        return
                      })

                      return this.array
                    }, err => { })

                }else if(this.entity && this.entity === 'DASH_HOME'){
                  this.dataForm.type = this.activeTab;
                  this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                    res => {
                      this.array = res

                      return this.array
                    }, err => { })

                  }else if(this.entity && this.entity === 'DASH_LOT'){
                    this.dataForm.type = this.activeTab;
                    this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                      res => {
                        this.array = res

                        return this.array
                      }, err => { })
                    }else if(this.entity && this.entity === 'DASH_PROSPECT'){
                      this.dataForm.type = this.activeTab;
                      this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                        res => {
                          this.array = res

                          return this.array
                        }, err => { })

                      }else if(this.entity && this.entity === 'DASH_RESERVATION'){
                        this.dataForm.type = this.activeTab;
                        this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                          res => {
                            this.array = res

                            return this.array
                          }, err => { })

                        }else if(this.entity && this.entity === 'DASH_INVOCEPRE'){
                          this.dataForm.type = this.activeTab;
                          this.filterService.viewer(this.dataForm, 'principal', this.uuid).subscribe(
                            res => {
                              this.array = res

                              return this.array
                            }, err => { })

                        }


  }
  onChangeLoad(type){
    this.activeTab = type
    this.loadData()
  }
  onPrinter() {
    if(this.entity && this.entity === 'SOLDE_OWNER' || this.entity && this.entity === 'LOYER' || this.entity && this.entity === 'CAUTION_OWNER' || this.entity == 'COMMISSION_OWNER'){
      this.dataForm.name = this.uuid;
      this.ownerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.dataForm);
    }else{
      this.walletService.getPrinterItem(this.userSession?.agencyKey, this.userSession?.uuid, this.dataForm?.uuid, this.dataForm?.type, this.dataForm?.dateD, this.dataForm?.dateF);
    }
  }

  editOwner(row) {
    this.ownerService.setOwner(row);
    this.ownerService.edit = true;
    this.ownerService.type = row.type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showOwner(row) {
    this.ownerService.setOwner(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }
  printerOwner(row): void {
    this.ownerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  editTenant(row) {
    this.tenantService.setTenant(row);
    this.tenantService.edit = true;
    this.tenantService.type = row.type;
    this.modal(TenantAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showTenant(row) {
    this.tenantService.setTenant(row);
    this.router.navigate(['/admin/locataire/show/' + row.uuid]);
  }
  printerTenant(row): void {
    this.tenantService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  editClient(row) {
    this.customerService.setCustomer(row);
    this.customerService.edit = true;
    this.customerService.type = row.type;
    this.modal(CustomerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showClient(row) {
    this.customerService.setCustomer(row);
    this.router.navigate(['/admin/client/show/' + row.uuid]);
  }
  printerClient(row): void {
    this.customerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  editRental(row) {
    this.rentalService.setRental(row);
    this.rentalService.edit = true;
    this.rentalService.type = row.type;
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showRental(row) {
    this.rentalService.setRental(row);
    this.router.navigate(['/admin/locative/show/' + row.uuid]);
  }
  printerRental(row): void {
    this.rentalService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  editContrat(row) {
    this.contratService.setContract(row);
    this.contratService.edit = true;
    this.modal(ContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showContrat(row): void {
    this.contratService.setContract(row);
    this.modal(ContractShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerContrat(row): void {
    this.contratService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  showMandat(item){
    this.mandatService.setMandate(item)
    this.mandatService.edit = false
    this.modal(SyndicMandateShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  editMandat(item){
    this.mandatService.setMandate(item)
    this.mandatService.edit = true
    this.modal(SyndicMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printMandat(item){
    this.mandatService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null);
  }
  editBien(row) {
    this.bienService.setHouse(row)
    this.bienService.edit = true
    this.bienService.disponible = row.disponible
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showBien(row) {
    this.bienService.setHouse(row)
    this.router.navigate(['/admin/proprietaire/bien/show/' + row.uuid]);
  }
  printerBien(row): void {
    this.bienService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  printerTicket(row): void {
    this.ticketService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
    this.modelRef.componentInstance.type = this.constructionService.type == "SYNDIC" ? "SYNDIC" : "LOCATIVE"
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  onClose(){
    this.modale.close('ferme');
  }

  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }

}
