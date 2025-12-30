import { Setting } from '@model/setting';
import { isObject, isString } from 'highcharts';
import { Component, OnInit } from '@angular/core';
import {SendService} from '@service/send/send.service';
import { OwnerService } from '@service/owner/owner.service';
import { TenantService } from '@service/tenant/tenant.service';
import { FilterService } from '@service/filter/filter.service';
import { SettingService } from '@service/setting/setting.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { CustomerService } from '@service/customer/customer.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProspectionService } from '@service/prospection/prospection.service';
import { TunnelService } from '@service/tunnel/tunnel.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  form: FormGroup;
  formFiltre: FormGroup;
  submit: boolean = false;
  sends: any[];
  dataShow: any;
  typageRow = [];
  Emails: any[];
  categorieRow: any[] = [];
  variable = null;
  nbMail: number = 0;
  filter: any;
  visible: string = null;
  setting: Setting;
  textePersonne: string = '';
  public isCollapsed: boolean = false;
  public isMail: string = 'sent' ;
  public detail: string = '';
  public isSubMail: string = 'primary';
  public basicContent: string = '<p>Put your things hear...</p>';
  prospectsRow: any[] = []

  typeRow = [
    {value: "MAIL", label: "Mail"},
    {value: "SMS", label: "Sms"},
  ];

  personalites = [
    {value: '', label: 'Selectionnez une personalisation', disabled: true},
    {value: 'PROPRIETAIRE', label: 'Propriétaire', disabled: false},
    {value: 'LOCATAIRE', label: 'Locataire', disabled: false},
    {value: 'CLIENT', label: 'Client', disabled: false},
    {value: 'PROSPECT', label: 'Prospect', disabled: false},
    {value: 'DEFINIR', label: 'Définir le ou les adresse(s) mail(s)', disabled: false},
  ];

  filtres = [
    {value: 'TOUT', label: 'Tout', disabled: true},
    {value: 'CLIENT', label: 'Client', disabled: false},
    {value: 'PROSPECT', label: 'Prospect', disabled: false},
    {value: 'LOCATAIRE', label: 'Locataire', disabled: false},
    {value: 'PROPRIETAIRE', label: 'Propriétaire', disabled: false},
    {value: 'DEFINIR', label: 'Définir le ou les adresse(s) mail(s)', disabled: false},
  ];
  wordCount: number = 0; //Nombre total de caracteres
  maxSms: number = 160; //Nombre maximum de caractere par SMS

  constructor(
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private sendService: SendService,
    private ownerService: OwnerService,
    private tunnelService: TunnelService,
    private tenantService: TenantService,
    private filterService: FilterService,
    private settingService: SettingService,
    private customerService: CustomerService,
    private promotionService: PromotionService,
    private prospectionService: ProspectionService,
    private subdivisionService: SubdivisionService
  ) {
    this.sendService.getList('MAIL', 'ENVOYE').subscribe(res => {
     this.sends = res;
     return this.sends;
    })
  }

  ngOnInit(): void {
    this.newForm();

    this.loadPage();
  }

  onFilter(){
    const data = this.formFiltre.getRawValue();
    this.filterService.search(data, 'mailSms', null).subscribe(
      res => {
        this.filter = this.filterService.filter;
        if(data.type === 'MAIL'){
          this.isSubMail = 'primary'
        }else if(data.type === 'SMS'){
          this.isSubMail = 'secondary'
        }
        return this.sends = res;
      }
    )
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      type: ['MAIL', [Validators.required]],
      destinataire: [null, [Validators.required]],
      objet: [null],
      content: [null, [Validators.required]],
      personalise: [null],
      categorie: [null],
      email: [null]
    })
    this.formFiltre = this.formBuild.group({
      personaliseFiltre: ['TOUT'],
      adresse: [null],
      mois: [null],
      type: ['MAIL']
    })
  }

  loadPage() {
    this.settingService.getSingle().subscribe((res: any)=> {
      return this.setting = res;
    }, error => {});
  }

  /**
   * Compter le nombre de caracteres dans le contenu d'un SMS
   */
  countWords(): void {
    this.wordCount = this.f.content.value.length;
  }

  onType(){
    this.f.objet.reset()
    this.f.email.reset()
    this.f.content.reset()
    this.f.categorie.reset()
    this.f.personalise.reset()
    this.f.destinataire.reset()
    this.f.personalise.setValue('')
  }

  add(){
    this.isMail = 'new'
    this.form.reset()
    this.f.type.setValue('MAIL')
    this.f.personalise.setValue('')
    this.nbMail = 0
  }

  onChangePersonalite(type: string){
    this.nbMail = 0
    this.f.categorie.setValue(null)
    this.typageRow = []
    if(type === 'PROPRIETAIRE'){
      this.typageRow = [
        {value: null, label: 'Selectionnez une catégorie'},
        {value: 'TOUT_PROPRIETAIRE', label: 'Tout les propriétaires'},
        {value: 'DEFINIR_PROPRIETAIRE', label: 'Un ou plusieurs propriétaire(s)'}
      ]
    }else if(type === 'CLIENT'){
      this.typageRow = [
        {value: null, label: 'Selectionnez une catégorie'},
        {value: 'TOUT_CLIENT', label: 'Tout les clients'},
        {value: 'DEFINIR_CLIENT', label: 'Un ou plusieurs client(s)'},
        {value: 'TOUT_PROMOTION', label: 'Tout les clients d\'une promotion'},
        {value: 'TOUT_LOTISSEMENT', label: 'Tout les clients d\'un lotissement'},
        {value: 'IMPAYE', label: 'À tous les clients qui ont un impayé'}
      ]
    }else if(type === 'LOCATAIRE'){
      this.typageRow = [
        {value: null, label: 'Selectionnez une catégorie'},
        {value: 'TOUT_LOCATAIRE', label: 'Tout les locataires'},
        {value: 'DEFINIR_LOCATIAIRE', label: 'Un ou plusieurs locataire(s)'},
        {value: 'LOCATIAIRE_IMPAYE', label: 'A tous les locataires qui ont un impayé'},
        {value: 'LOCATIAIRE_PROPRIETAIRE', label: 'Tout les locataires d\'un propriétaire'}
      ]
    }else if(type === 'PROSPECT'){
      this.typageRow = [
        {value: null, label: 'Selectionnez une catégorie'},
        {value: 'TOUT_PROSPECT', label: 'Tout les prospects'},
        {value: 'DEFINIR_PROSPECT', label: 'Un ou plusieurs prospect(s)'},
        {value: 'ETAT_PROSPECT', label: 'Les prospects qui ont un etat'}
      ]
    }else if(type === 'DEFINIR'){
      this.f.destinataire.reset()
    }
  }

  onChangeCategorie(type: string){
    this.nbMail = 0
    this.visible = type
    this.f.email.reset()
    if(type === 'IMPAYE'){
      this.customerService.getList('IMPAYE', null, 'ALL').subscribe((res: any) => {
        this.onSearch(res, 'CLIENT')
      })
    }
    // else if (type === 'LOCATIAIRE_IMPAYE'){
    //   this.tenantService.getList(null, null, 'IMPAYE').subscribe((res: any) => {
    //     this.onSearch(res, 'LOCATAIRE')
    //   })
    // }
    else if(type === 'TOUT_CLIENT'){
      this.customerService.getList().subscribe((res: any) => {
        this.onSearch(res, 'CLIENT')
      })
    }else if(type === 'TOUT_LOCATAIRE'){
      this.tenantService.getList(null, 'ALL').subscribe((res: any) => {
        this.onSearch(res, 'LOCATAIRE')
      })
    }else if(type === 'TOUT_PROSPECT'){
      this.prospectionService.getList(null, null, null, 'ALL').subscribe((res: any) => {
        this.onSearch(res, 'PROSPECT')
      })
    }else if(type === 'DEFINIR_PROSPECT'){
      this.textePersonne = 'Selectionnez le ou les prospect(s)'
      this.prospectionService.getList(null, null, null, 'ALL').subscribe((res: any) => {
        this.categorieRow = res
      })
    }else if(type === 'DEFINIR_CLIENT'){
      this.textePersonne = 'Selectionnez le ou les client(s)'
      this.customerService.getList(null, null, 'ALL').subscribe((res: any) => {
        this.categorieRow = res
      })
    }else if(type === 'TOUT_PROMOTION'){
      this.textePersonne = 'Selectionnez la promotion'
      this.promotionService.getList().subscribe((res: any) =>{
        this.categorieRow = res
      })
    }else if(type === 'TOUT_LOTISSEMENT'){
      this.subdivisionService.getList('ALL').subscribe((res: any) => {
        this.categorieRow = res
      })

    }else if(type === 'TOUT_PROPRIETAIRE'){
      this.ownerService.getList('ALL').subscribe((res: any) => {
        this.onSearch(res, 'PROPRIETAIRE')
      })
    }else if(type === 'DEFINIR_LOCATIAIRE'){
      this.textePersonne = 'Selectionnez le ou les locataire(s)'
      this.tenantService.getList(null, 'ALL').subscribe((res: any) => {
        this.categorieRow = res
      })
    }else if(type === 'DEFINIR_PROPRIETAIRE'){
      this.textePersonne = 'Selectionnez le ou les propriétaire(s)'
      this.ownerService.getList('ALL').subscribe((res: any) => {
        this.categorieRow = res
      })
    }else if(type === 'LOCATIAIRE_PROPRIETAIRE'){
      this.textePersonne = 'Selectionnez le propriétaire'
      this.ownerService.getList('ALL').subscribe((res: any) => {
        this.categorieRow = res
      })
    }else if(type === 'ETAT_PROSPECT'){
      this.textePersonne = 'Selectionnez l\'etat'
      this.tunnelService.getList(null).subscribe((res: any)=> {
        this.categorieRow = res[0].etapes
      });
    }else if(type === 'LOCATIAIRE_IMPAYE'){
      this.textePersonne = 'Etat'
        this.categorieRow = [
          {value: 'ENTREE', label: 'Entrée'},
          {value: 'LOYER', label: 'Loyer'},
          {value: 'PENALITY', label: 'Pénalité'},
        ]
    }
  }

  onChangeTiers(uuid: string, type: string){
    this.nbMail = 0
    console.log('uuid', uuid, 'type', type)
    if(type === 'TOUT_PROMOTION'){
      if(uuid){
        this.customerService.getList('PROMOTION',uuid).subscribe((res: any) => {
          this.onSearch(res, 'CLIENT')
        })
      }
    }else if(type === 'TOUT_LOTISSEMENT'){
      if(uuid){
        this.customerService.getList('LOTISSEMNT', uuid).subscribe((res: any) => {
          this.onSearch(res, 'CLIENT')
        })
      }
    }else if(type === 'LOCATIAIRE_PROPRIETAIRE'){
      if(uuid){
        this.tenantService.getList(uuid).subscribe((res: any) => {
          this.onSearch(res, 'LOCATAIRE')
        })
      }
    }else if(type === 'LOCATIAIRE_IMPAYE'){
      if(uuid){
        this.tenantService.getList(null, null, uuid).subscribe((res: any) => {
          this.onSearch(res, 'LOCATAIRE')
        })
      }
    }else if(type === 'ETAT_PROSPECT'){
    this.prospectionService.getList(null, uuid).subscribe((res: any) => {
      res.forEach((item: any) => {
          this.prospectsRow.push(item)
      })
      this.onSearch(this.prospectsRow, 'PROSPECT')
    })
    }
  }

  onSearch(row: any, type:string){
    let dataEmails = []
    if(type === 'PROPRIETAIRE' || type === 'LOCATAIRE'|| type === 'PROSPECT'){
      if(this.f.type.value === 'MAIL'){
        row.forEach((item: any) => {
          dataEmails.push(item?.email)
        });
      }else if(this.f.type.value === 'SMS'){
        row.forEach((item: any) => {
          dataEmails.push(item?.telephone)
        });
      }
    }else if(type === 'CLIENT'){
      if(this.f.type.value === 'MAIL'){
        row.forEach((item: any) => {
          dataEmails.push(item?.user?.email)
        });
      }else if(this.f.type.value === 'SMS'){
        row.forEach((item: any) => {
          dataEmails.push(item?.telephone)
        });
      }
    }
    this.Emails = dataEmails
    this.f.destinataire.setValue(dataEmails)
    this.nbMail = this.Emails.length
  }

  definirPerosonne(email: any){
    this.f.destinataire.setValue(email)
    if(email !== null){
      this.nbMail = email.length;
    }
  }
  // Définir email
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    this.form.get('email').value.forEach(element => {
      if(isObject(element) && element.ngOptionValue && element.ngOptionValue !== null){
        arr.push(
          this.formBuild.group({
            email: [element.ngOptionValue, [Validators.required]]
          })
        );
      } else if(isString(element) && element) {
        arr.push(
          this.formBuild.group({
            email: [element, [Validators.required]]
          })
        );
      }
    });
    return arr;
  }

  onChange(type: string, option: string, etat: string, methode: string){
    if(methode === 'ONCHANGE'){
      this.isSubMail = option
    }else if(methode === 'ONCHANGING'){
      this.isMail = option
      if(type === 'MAIL'){
        this.isSubMail = 'primary'
      }
    }
    this.sendService.getList(type, etat).subscribe(res => {
      this.sends = res
      return this.sends
    })
  }

  onCorbeille(item: any, type: string){
    const data = {uuid: item.uuid, type: type}
    this.sendService.corbeille(data).subscribe(res => {
      this.onStatus(res, item)
    })
  }

  delete(row: any){
    this.sendService.getDelete(row.uuid).subscribe(res => {
      this.onStatus(res, row)
    })
  }

  onSend(item: any){
    this.sendService.sendBack(item).subscribe(res => {
      this.onStatus(res, item)
    })
  }

  onStatus(res: any, item: any){
    if (res.status === 'success') {
      const index = this.sends.findIndex((x) => {
        return x.uuid === item.uuid;
      });
      if (index !== -1) {
        this.sends.splice(index, 1);
      }
    }
  }

  onShow(item: any, type: string){
    if(type === 'ENVOI'){
      this.isMail = 'showEnvoi'
    }else if(type === 'CORBEIL'){
      this.isMail = 'showCorbeil'
    }else if(type === 'ATTENTE'){
      this.isMail = 'showAttente'
    }
    let data = []
    item.destinataire.forEach((item) => {
      data.push(item)
    })
    this.dataShow = item
    this.dataShow.destinataire = data
  }

  onSubmit(){
    this.submit = true;
    if (this.form.valid) {
      this.sendService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success'){
          this.emitter.emit({action: 'SEND_ADD', payload: res?.data});
          this.isMail = 'sent'
          this.form.reset()
          this.sendService.getList('MAIL', 'ENVOYE').subscribe(res => {
            this.sends = res
            return this.sends
           })
        }
      }, error => {});
    } else {
      return;
    }
  }

  onDestinataire(input: any) {
    let text = input.target.value.trim();
    if (text.includes(",") || text.includes(" ")) {
      let elements = text.split(/,|\s+/);
      this.f.destinataire.setValue(elements)
      this.nbMail = elements.length
    }else{
      this.f.destinataire.setValue([text])
      this.nbMail = 1
    }
  }

  onSubStringLongName(str: string): any {
    if (str !== null) {
      if (str.length > 70) {
        return str.substring(0, 70) + ' ...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  }

  get f() {return this.form.controls;}
  get destinataire() { return this.form.get('destinataire') as FormArray; }
  get g() {return this.formFiltre.controls;}
}
