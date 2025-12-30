import { Day } from '@model/day';
import {Spent} from '@model/spent';
import {Supply} from '@model/supply';
import {Payment} from '@model/payment';
import {Treasury} from '@model/treasury';
import {FormGroup} from '@angular/forms';
import * as Highcharts from 'highcharts';
import { Globals } from '@theme/utils/globals';
import {FundRequest} from '@model/fund-request';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DayService } from '@service/day/day.service';
import {PaymentFunding} from '@model/payment-funding';
import {PaymentCustomer} from '@model/payment-customer';
import HC_drilldown from 'highcharts/modules/drilldown';
import { ActivatedRoute, Router } from '@angular/router';
import {PaymentRepayment} from '@model/payment-repayment';
import { SpentService } from '@service/spent/spent.service';
import { SupplyService } from '@service/supply/supply.service';
import { FilterService } from '@service/filter/filter.service';
import {PaymentService} from '@service/payment/payment.service';
import {TreasuryService} from '@service/treasury/treasury.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FundRequestService} from '@service/fund-request/fund-request.service';
import { ConfirmationService } from '@service/confirmation/confirmation.service';
import { DayAddComponent } from '@agence/tresorerie/day/day-add/day-add.component';
import {PaymentFundingService} from '@service/payment-funding/payment-funding.service';
import {PaymentAddComponent} from '@locataire/payment/payment-add/payment-add.component';
import { SpentAddComponent} from '@agence/tresorerie/spent/spent-add/spent-add.component';
import {PaymentCustomerService} from '@service/payment-customer/payment-customer.service';
import {PaymentRepaymentService} from '@service/payment-repayment/payment-repayment.service';
import { SupplyAddComponent} from '@agence/tresorerie/supply/supply-add/supply-add.component';
import {TreasuryAddComponent} from '@agence/tresorerie/treasury/treasury-add/treasury-add.component';
import {PaymentCustomerAddComponent} from '@client/payment/payment-customer-add/payment-customer-add.component';
import { PaymentFundingAddComponent } from '@chantier/payment/payment-funding-add/payment-funding-add.component';
import { ConfirmationAddComponent } from '@agence/tresorerie/confirmation/confirmation-add/confirmation-add.component';
import { PaymentRepaymentAddComponent } from '@agence/proprietaire/payment/payment-repayment-add/payment-repayment-add.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { InvoicePaymentAddComponent } from '@agence/chantier/invoice-payment/invoice-payment-add/invoice-payment-add.component';
import { InvoicePaymentService } from '@service/invoice-payment/invoice-payment.service';
import { WithdrawalAddComponent } from '@agence/tresorerie/wallet/withdrawal-add/withdrawal-add.component';
import { SupplyWalletComponent } from '@agence/tresorerie/supply/supply-wallet/supply-wallet.component';
import { WalletService } from '@service/wallet/wallet.service';
import { DepositAddComponent } from '@agence/tresorerie/wallet/deposit-add/deposit-add.component';
import { OwnerService } from '@service/owner/owner.service';
HC_drilldown(Highcharts);

@Component({
  selector: 'app-treasury-show',
  templateUrl: './treasury-show.component.html',
  styleUrls: ['./treasury-show.component.scss']
})
export class TreasuryShowComponent implements OnInit {
  [x: string]: any;

  //variable du graph
  public Highcharts = Highcharts;
  public barBasicChartOptions: any

  pieDem = 0
  pieDep = 0
  pieRev= 0
  piePay= 0
  piePayCus = 0
  piePayFun = 0
  pieApp = 0

  widget = []
  mtnDem= []
  mtnDep= []
  mtnPayt = []
  mtnPaytC = []
  mtnPaytF = []
  mtnSupp = []
  mtnRever = []
  mois = []
  form: FormGroup;
  filtre: boolean = false;
  verif: boolean = false;
  button: boolean = false;
  tresorerie: boolean = false;
  isHidden: boolean = false;
  treasury: Treasury;
  supplies: Supply[];
  funds: FundRequest[];
  days: Day[];
  spents: Spent[];
  payments: Payment[];
  visible: boolean = false;
  visibilite: boolean = false;
  paymentsRepayment: PaymentRepayment[];
  paymentsCustomer: PaymentCustomer[];
  paymentsFunding: PaymentFunding[];
  type: string = 'TRESORERIE';
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  filter: any;
  etatRow = [
    { label: 'ACTIF', value: 'ACTIF' },
    { label: 'INACTIF', value: 'INACTIF' }
  ]
  typeRow = [
    {label: 'TRESORERIE DE BORD', value: 'TRESORERIE'},
    {label: 'PAIEMENT REVERSEMENT', value: 'REVERSEMENT'},
    {label: 'DEMANDE', value: 'DEMANDE'},
    {label: 'DEPENSE', value: 'DEPENSE'},
    {label: 'PAIEMENT LOCATAIRE', value: 'LOCATAIRE'},
    {label: 'PAIEMENT FINANCEMENT', value: 'FINANCEMENT'},
    {label: 'PAIEMENT CLIENT', value: 'CLIENT'},
    {label: 'APPROVISIONNEMENT', value: 'APPROVISIONNEMENT'},
    {label: 'JOURNEE', value: 'JOURNEE'},
  ];
  categorieRow = [
    {label: 'EN LOCATION', value: 'LOCATION'},
    {label: 'EN VENTE', value: 'VENTE'}
  ];
  event = {
    categorie: null,
    libelle: null,
    user: null,
    designation: null,
    bien: null,
    autre: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    etat: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "TRESORERIE",
    uuid: null
  }
  minTitle: string = "Montant MIN"
  userTitle: string = "Crée par"
  maxTitle: string = "Montant MAX"
  nameTitle: string = "Nom / Libellé"
  name: boolean = true
  etatTitle: string = "Disponibilité ?"
  categorieTitle: string = "Type de bien"
  cookie: string = ''
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })

  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChartTag: CanvasRenderingContext2D;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private dayService: DayService,
    private modalService: NgbModal,
    private spentService: SpentService,
    private ownerService: OwnerService,
    public boarding: OnBoardingService,
    private supplyService: SupplyService,
    private filterService: FilterService,
    private walletService: WalletService,
    private cookieService: CookieService,
    private paymentService: PaymentService,
    private treasuryService: TreasuryService,
    private fundRequestService: FundRequestService,
    private confirmationService: ConfirmationService,
    private permissionsService: NgxPermissionsService,
    private paymentFundingService: PaymentFundingService,
    private invoicePaymentService: InvoicePaymentService,
    private paymentCustomerService: PaymentCustomerService,
    private paymentRepaymentService: PaymentRepaymentService
  ) {
    this.verif = this.treasuryService?.day
    this.onChangeLoad(this.type);
    this.onFilter(this.event);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.getGraph();
    this.getPie();
    if(this.verif){
      this.filterService.dashboard(this.event, 'treasury', this.route.snapshot.params.id).subscribe(
        res => {
          this.getGraph();
          this.getPie();
          this.onSet(res);
      }, err => {})
    }
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('treasury-show');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-treasury-show') {
    //   this.boarding.treasuryShow(etat);
    // }
    // this.boarding.treasuryShow(etat);
  }

  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    if($event.type !== 'TRESORERIE'){
      this.filterService.search($event, 'treasury', this.route.snapshot.params.id).subscribe(
        res => {
        this.filter = this.filterService.filter
        if($event.type === 'LOCATAIRE'){
          return this.payments = res;
        } else if($event.type === 'CLIENT'){
          return this.paymentsCustomer = res;
        } else if($event.type === 'APPROVISIONNEMENT'){
          return this.supplies = res;
        } else if($event.type === 'JOURNEE'){
          return this.days = res;
        } else if($event.type === 'DEMANDE'){
          return this.funds = res;
        }else if($event.type === 'DEPENSE'){
          return this.spents = res;
        }else if($event.type === 'FINANCEMENT'){
          return this.paymentsFunding = res;
        }else if($event.type === 'REVERSEMENT'){
          return this.paymentsRepayment = res;
        }
      }, err => { })
    } else{
      this.filterService.dashboard($event, 'treasury', this.route.snapshot.params.id).subscribe(
        res => {
          this.onSet(res);
      }, err => { })
    }
  }
  onSet(res){
    if (res) {
      this.widget = res?.widget
      this.getGraph();
      this.getPie();
      this.mtnDem = []
      this.mtnDep = []
      this.mtnRever = []
      this.mtnPayt = []
      this.mtnPaytC = []
      this.mtnPaytF = []
      this.mtnSupp = []
      this.mois = []
      res?.graph.forEach(el => {
        this.mtnDem.push(el?.dem)
        this.mtnDep.push(el?.dep)
        this.mtnRever.push(el?.rever)
        this.mtnPayt.push(el?.pay)
        this.mtnPaytC.push(el?.payC)
        this.mtnPaytF.push(el?.payF)
        this.mtnSupp.push(el?.supp)
        this.mois.push(el?.date)
      });

      this.pieDem = res?.pie?.nbrDem
      this.pieDep = res?.pie?.nbrDep
      this.pieRev = res?.pie?.nbrR
      this.piePay = res?.pie?.nbrP
      this.piePayCus = res?.pie?.nbrPc
      this.piePayFun = res?.pie?.nbrPf
      this.pieApp = res?.pie?.nbrA
    }
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TRESORERIE'){
      if(!this.treasury){
        this.treasuryService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          if (res) {
            this.verif = res?.days.length > 0 ? true : false
            if (this.verif === false) {
              this.isHidden = true
              this.typeRow = res?.type === "CAISSE" ? [{label: 'JOURNEE', value: 'JOURNEE'}] : [{label: 'Rapprochement', value: 'JOURNEE'}];
              var text = res?.type === "CAISSE" ? " Veuillez proceder à la création de la première journée de votre caisse avant toutes opérations." :
                "Veuillez proceder à la création du premier rapprochement bancaire avant toutes opérations."
              Swal.fire({
                title: res?.type === "CAISSE" ? "Overture de caisse" : "Rapprochement bancaire",
                text: text,
                icon: "warning",
                allowOutsideClick: false,
                timer: 30000
              })
            }
            return this.treasury = res;
          }
        });
      }
      this.nameTitle = 'Nom'
      this.name = false
      this.categorieTitle = 'Type tresorerie'
      this.etatRow = [];
      this.categorieRow = [];
      this.visible = true;
      this.visibilite = true;
    } else if ($event === 'DEMANDE'){
      this.fundRequestService.getList(this.route.snapshot.params.id, 'TRANSMIS').subscribe((res) => {
        return this.funds = res;
        }, error => {}
      );
      this.nameTitle = 'Trésorerie'
      this.name = false
      this.etatRow = [
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'DECAISSE', value: 'DECAISSE'}
      ];
      this.categorieRow = [];
      this.visible = false;
      this.visibilite = false;
    } else if ($event === 'DEPENSE'){
      this.spentService.getList(this.route.snapshot.params.id).subscribe((res) => {return this.spents = res; }, error => {});
      this.nameTitle = 'Trésorerie'
      this.categorieTitle = 'Type de dépense'
      this.etatTitle = 'Etat'
      this.name = false
      this.etatRow = [
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'VALIDER', value: 'VALIDER'}
      ];
      this.categorieRow = [
        {label: 'STANDARD', value: 'STANDARD'},
        {label: 'PROPRIETAIRE', value: 'PROPRIETAIRE'}
      ];
      this.visible = true;
      this.visibilite = false;
    } else if($event === 'APPROVISIONNEMENT'){
      this.supplyService.getList(this.route.snapshot.params.id).subscribe((res) => {
        return this.supplies = res;
        }, error => {}
      );
      this.nameTitle = 'Trésorerie'
      this.categorieTitle = 'Type tresorerie'
      this.etatRow = [];
      this.categorieRow = [];
      this.visible = false;
      this.visibilite = false;
    } else if($event === 'LOCATAIRE'){
      this.paymentService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res) => {
        return this.payments = res;
        }, error => {}
      );
      this.name = true
      this.nameTitle = 'Locataire'
      this.categorieTitle = 'Type'
      this.categorieRow = [
        {label: "FACTURE D'ENTREE", value: 'ENTREE'},
        {label: "AUTRES FACTURE", value: 'AUTRE'},
        {label: 'LOYER', value: 'LOYER'},
        {label: 'PENALITE', value: 'PENALITE'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.visible = false;
      this.visibilite = false;
    } else if($event === 'FINANCEMENT'){
      this.paymentFundingService.getList(this.route.snapshot.params.id).subscribe((res) => {
        return this.paymentsFunding = res;
        }, error => {}
      );
      this.name = true
      this.nameTitle = 'Chantier'
      this.categorieTitle = 'Type tresorerie'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
      this.visible = true;
      this.visibilite = false;
    } else if($event === 'CLIENT'){
      this.name = true
      this.paymentCustomerService.getList(null, null, null, this.route.snapshot.params.id).subscribe((res) => {
        return this.paymentsCustomer = res;
        }, error => {}
      );
      this.nameTitle = 'Client'
      this.categorieTitle = 'Type'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [
        {label: 'DEBIT', value: 'DEBIT'},
        {label: 'CREDIT', value: 'CREDIT'}
      ];
      this.visible = false;
      this.visibilite = false;
    } else if($event === 'JOURNEE'){
      this.name = false
      this.dayService.getList(this.route.snapshot.params.id).subscribe((res) => {
        return this.days = res;
        }, error => {}
      );
      this.nameTitle = 'Trésorerie'
      this.etatTitle = 'Etat'
      this.categorieTitle = 'Type tresorerie'
      this.etatRow = [
        {label: 'CLOT', value: 'CLOT'},
        {label: 'ACTIF', value: 'ACTIF'}
      ];
      this.categorieRow = [];
      this.visible = true;
      this.visibilite = false;
    } else if($event === 'REVERSEMENT'){
      this.paymentRepaymentService.getList(this.route.snapshot.params.id, null, null).subscribe((res) => {
        return this.paymentsRepayment = res;
        }, error => {}
      );
      this.name = true
      this.nameTitle = 'Proprietaire'
      this.categorieTitle = 'Type de reversement'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [
        {label: 'VENTE', value: 'VENTE'},
        {label: 'LOCATION', value: 'LOCATION'}
      ];
      this.visible = true;
      this.visibilite = false;
    }
  }
  onPrinter() {
    if(this.type === 'REVERSEMENT'){
      this.paymentRepaymentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DEMANDE') {
      this.fundRequestService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DEPENSE') {
      this.spentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.route.snapshot.params.id);
    } else if(this.type === 'LOCATAIRE') {
      this.paymentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'FINANCEMENT') {
      this.paymentFundingService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CLIENT') {
      this.paymentCustomerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'APPROVISIONNEMENT') {
      this.supplyService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'JOURNEE') {
      this.dayService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    if(this.type === 'DEMANDE') {
      this.fundRequestService.getGenerer();
    }else if(this.type === 'LOCATAIRE') {
      this.paymentService.getGenerer();
    }else if(this.type === 'CLIENT') {
      this.paymentCustomerService.getGenerer();
    }else if(this.type === 'APPROVISIONNEMENT') {
      this.supplyService.getGenerer();
    }
  }
  onExport() {
    if(this.type === 'REVERSEMENT'){
      this.paymentRepaymentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DEMANDE') {
      this.fundRequestService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DEPENSE') {
      this.spentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'LOCATAIRE') {
      this.paymentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'FINANCEMENT') {
      this.paymentFundingService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CLIENT') {
      this.paymentCustomerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'APPROVISIONNEMENT') {
      this.supplyService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'JOURNEE') {
      this.dayService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  addDeposit() {
    this.modalService.dismissAll();
    this.ownerService.setOwner(null);
    this.treasuryService.setTreasury(this.treasury);
    this.modal(DepositAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  addWithdrawll() {
    this.modalService.dismissAll();
    this.ownerService.setOwner(null);
    this.treasuryService.setTreasury(this.treasury);
    this.modal(WithdrawalAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  addPayementTenant(treasury) {
    this.modalService.dismissAll();
    this.paymentService.edit = false;
    this.paymentService.isTreso = "OUI";
    this.paymentService.treasury = treasury;
    this.modal(PaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addInvoicePayment(treasury) {
    this.modalService.dismissAll();
    this.invoicePaymentService.edit = false;
    this.invoicePaymentService.treasury = treasury;
    this.modal(InvoicePaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.treasury = this.treasury.uuid
  }
  addPayementCustomer(treasury) {
    this.modalService.dismissAll();
    this.paymentCustomerService.edit = false;
    this.paymentCustomerService.treasury = treasury;
    this.modal(PaymentCustomerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addPaymentFunding(treasury) {
    this.modalService.dismissAll();
    this.paymentFundingService.edit = false;
    this.paymentFundingService.treasury = treasury;
    this.modal(PaymentFundingAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addSpent(treasury) {
    this.modalService.dismissAll();
    this.spentService.edit = false;
    this.spentService.treasury = treasury;
    this.modal(SpentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addSupply(treasury) {
    this.modalService.dismissAll();
    this.supplyService.edit = false;
    this.supplyService.treasury = treasury;
    this.modal(SupplyAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addPayementRepayment(treasury) {
    this.modalService.dismissAll();
    this.paymentRepaymentService.edit = false;
    this.paymentRepaymentService.treasury = treasury;
    this.modal(PaymentRepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addConfirmation(treasury) {
    this.modalService.dismissAll();
    this.confirmationService.edit = false;
    this.confirmationService.treausry = treasury;
    this.modal(ConfirmationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addDay(treasury, type) {
    this.modalService.dismissAll();
    this.dayService.edit = false;
    this.dayService.treasury = treasury;
    this.dayService.type = type;
    this.modal(DayAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  editTreasury() {
    this.treasuryService.setTreasury(this.treasury);
    this.treasuryService.edit = true;
    this.modal(TreasuryAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  getGraph () {
    this.barBasicChartOptions = {
      chart: {
        type: 'column'
      },
      colors: ['#b3e0ff', '#FF5733', '#2ABF0F', 'red', 'yellow', '#D63FF7', 'gray'],
      title: {
        text: 'DIAGRAMME EN BANDE DES TRANSACTION'
      },
      xAxis: {
        categories: (this.mois),
        crosshair: true
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: this.global.device
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>' ,
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        color: '#b3e0ff',
        name: 'Demande',
        data: this.mtnDem

      }, {
        color: '#FF5733',
        name: 'Depense',
        data: this.mtnDep

      },{
        color: '#2ABF0F',
        name: 'Reversement',
        data: this.mtnRever

      }, {
        color: 'red',
        name: 'Paiement locataire',
        data: this.mtnPayt
      }, {
        color: 'yellow',
        name: 'Paiement client',
        data: this.mtnPaytC
      }, {
        color: '#D63FF7',
        name: 'Paiement financement',
        data: this.mtnPaytF
      }, {
        color: 'gray',
        name: 'Approvisionnement',
        data: this.mtnSupp
      },
    ]
    };
  }
  getPie(){
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart?.nativeElement as HTMLCanvasElement)?.children));
      this.pieChartTag = ((pieTag['doughnut_chart'])?.lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData = {
        labels: ["Demande", "Dépense", "Reversement", 'Paiement locataire', "Paiement client", "Paiement financement", 'Approvisionement'],
        datasets: [{
          data: [this.pieDem, this.pieDep, this.pieRev, this.piePay, this.piePayCus, this.piePayFun, this.pieApp],
          backgroundColor: ['#b3e0ff', '#FF5733', '#2ABF0F', '#FF0000', '#FFFF00', '#D63FF7', '#808080'],
          hoverBackgroundColor: ['#b3e0ff', '#FF5733', '#2ABF0F', '#FF0000', '#FFFF00', '#D63FF7', '#808080']
        }]
      };
    });
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
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }
  modal(component, type, size, center, backdrop, inputs?) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    })
  }
  back(){ this.router.navigate(['/admin/tresorerie']) }
}
