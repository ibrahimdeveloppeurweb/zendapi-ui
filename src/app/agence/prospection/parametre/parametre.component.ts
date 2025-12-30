import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Etape } from '@model/etape';
import { Tunnel } from '@model/tunnel';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EtapeService } from '@service/etape/etape.service';
import { TunnelService } from '@service/tunnel/tunnel.service';
import { SettingService } from '@service/setting/setting.service';
import { UserService } from '@service/user/user.service';

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})
export class ParametreComponent implements OnInit {
  frais: any;
  form: FormGroup;
  title: string = ""
  fraisForm: FormGroup;
  commercialForm: FormGroup;
  edit: boolean = false;
  editFrai: boolean = false;
  type: string = "CONFIGURATION"
  fraisTitle: string = "Frais de pré-réservation"
  tunnel: Tunnel;
  chefSelected: any;
  gestSelected: any;
  tunnelLocation: Tunnel;
  etapesRow: Etape[] = [];
  users:  [];

  commercialRow = [
    {label : 'ENVOI MAIL', value: 'ENVOI MAIL'},
    {label : 'APPEL TELEPHONIQUE', value: 'APPEL TELEPHONIQUE'},
    {label : 'VISITE BUREAU', value: 'VISITE BUREAU'},
    {label : 'VISITE CHANTIER', value: 'VISITE CHANTIER'},
    {label : 'RDV', value: 'RDV'},
    {label : 'CONTRACTS ENVOYES', value: 'CONTRACTS ENVOYES'},
    {label : 'ENVOI DE CONNTRAT', value: 'ENVOI DE CONNTRAT'},
    {label : 'ATTENTE DE RECPTION DU CONTRAT', value: 'ATTENTE DE RECPTION DU CONTRAT'},
    {label : 'ATTENTE VERSEMENT APPORT', value: 'ATTENTE VERSEMENT APPORT'},
    {label : 'CONTRAT IMCOMPLET', value: 'CONTRAT IMCOMPLET'},
    {label : 'CONTRAT À RESIGNER', value: 'CONTRAT À RESIGNER'},
  ]

  constructor(
    private userService: UserService,
    private formBuild: FormBuilder,
    private etapeService: EtapeService,
    private settingService: SettingService,
    private tunnelService: TunnelService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.newForm(),
    this.newFraisForm(),
    this.etapeService.getList().subscribe(res => {  return this.etapesRow = res  })
    this.settingService.getChef().subscribe(res => {
      this.commercialForm.get('user').setValue(res.uuid)
      return res ? this.chefSelected = res.uuid : null
    })

    this.title = "TUNNEL DE PROSPECTION DE L'AGENCE"
    this.tunnelService.getList('VENTE').subscribe((res: any)=> {
      if(this.type === 'VENTE'){
        this.tunnel = res[0];
      }else{
        this.tunnelLocation = res[0];
      }
      this.editForm()
    }, error => {});

    this.onDisplay(this.type)
    this.editFraisForm()
    this.editFraisForm()
  }

  ngOnInit(): void {
    this.userService.getList().subscribe((res: any)=> {
      this.users = res;
    })
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: [null, [Validators.required]],
      etapes: this.formBuild.array([]),
      removes: this.formBuild.array([])
    });
    this.commercialForm = this.formBuild.group({
      user: [null, [Validators.required]]
    });
  }
  newFraisForm() {
    this.fraisForm = this.formBuild.group({
      uuid: [null],
      id: [null],
      fraisVente: [null],
      fraisLocation: [null],
      location: [null],
      vente: [null],
    });
  }
  editForm() {
    this.form.reset();
    this.f.type.setValue(this.type)
    if(this.type === 'VENTE'){
      const data = {...this.tunnel};
      this.form.patchValue(data);
      this.etapes.controls = [];
      this.etapes.clear();
      if(data && data?.etapes?.length > 0){
        data.etapes.forEach((etape:any, i) => {
          this.etapes.push(
            this.formBuild.group({
              id: [etape?.id],
              uuid: [etape?.uuid],
              numero: [i + 1],
              etape: [{value: etape?.uuid, disabled: !this.edit}, [Validators.required]],
              dure: [{value: etape?.durer, disabled: !this.edit}, [Validators.required]],
              action:[{value: etape?.actions, disabled: !this.edit}, [Validators.required]]
            })
          )
        });
      }
    }else{
      const data = {...this.tunnelLocation};
      this.form.patchValue(data);
      this.etapes.controls = [];
      this.etapes.clear();
      if(data && data?.etapes?.length > 0){
        data.etapes.forEach((etape: any, i) => {
          this.etapes.push(
            this.formBuild.group({
              id: [etape?.id],
              uuid: [etape?.uuid],
              numero: [i + 1],
              etape: [{value: etape?.uuid, disabled: !this.edit}, [Validators.required]],
              dure: [{value: etape?.durer, disabled: !this.edit}, [Validators.required]],
              action:[{value: etape?.actions, disabled: !this.edit}, [Validators.required]]
            })
          )
        });
      }
    }
  }
  editFraisForm() {
    const data = {...this.frais};
    this.fraisForm.patchValue(data);
  }
  editTunnel(value){
    this.edit = value
    this.title = this.edit ? "MODIFICATION LE TUNNEL DE PROSPECTION DE L'AGENCE" : "TUNNEL DE PROSPECTION DE L'AGENCE"
    this.editForm()
  }
  editFrais(value){
    this.editFrai = value
    this.fraisTitle = value ? "Modification de frais de pré-réservation" : "Frais de pré-réservation"
    if(!this.editFrai){
      this.editFraisForm()
    }
  }
  // Fonction appelée au changement de ng-select
  onChangeAction(index: number): void {
    const selectedValues = this.etapes.at(index).get('action').value;
  }
  selectEtape(uuid, row){
    if(uuid){
      row.get('etape').setValue(uuid);
    } else {
      row.get('etape').setValue(null);
    }
  }
  setEtapeUuid(uuid, row){
    if(uuid){
      row.get('etape').setValue(uuid);
    } else {
      row.get('etape').setValue(null);
    }
  }
  onAddEtape(i, type){
    this.etapes.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        numero: [this.etapes.length +  1, [Validators.required]],
        etape: [null, [Validators.required]],
        dure: [null, [Validators.required]],
        action:[null, [Validators.required]],
        etapeSelected: [null]
      })
    );
  }



  onDelete(i, uuid){
    this.etapes.removeAt(i);
    this.removes.push(
      this.formBuild.group({
        uuid: [uuid],
      })
    );
  }

  onSubmit(type) {
    let text = type === 'TUNNEL' ? "Les modifications apportées au tunnel de prospection auront un impact sur les informations existantes concernant les prospects. Tous les prospects qui se trouvent dans les étapes retirées du tunnel seront considérés comme archivés." : "Voulez-vous vraiment enregistrer les modifications ?"
    Swal.fire({
      title: '',
      text: text,
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Modifier <i class="fas fa-attachment"></i>',
      confirmButtonColor: '#3EE655',
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        if(type === 'TUNNEL') {
          this.send()
        } else if ('COMMERCIAL') {
          this. sendCommercial()
        }else{
          this.sendFrais()
        }
      }
    });
  }

  onSubmitCommercial() {
    let text = "Voulez-vous vraiment enregistrer un commerçial ?";
    Swal.fire({
      title: '',
      text: text,
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Enregistrer <i class="fas fa-attachment"></i>',
      confirmButtonColor: '#3EE655',
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this. sendCommercial()
      }
    });
  }

  send() {
    this.tunnel = null
    this.tunnelLocation = null
    this.tunnelService.add(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        if(this.type === 'VENTE') {
          this.tunnel = res;
        } else if(this.type === 'LOCATION') {
          this.tunnelLocation = res;
        }
        this.title = "TUNNEL DE PROSPECTION DE L'AGENCE"
        this.edit = false
        this.editForm()
      }
    }, error => {});
  }

  sendFrais() {
    this.settingService.frais(this.fraisForm.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.title = "Frais de pré-réservation"
        this.edit = false
        this.editFraisForm()
      }
    }, error => {});
  }

  sendCommercial() {
    this.settingService.createCommercial(this.commercialForm.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.edit = false
        this.editFraisForm()
      }
    }, error => {});
  }


  onDisplay(type: string) {
    this.type = type;
    this.tunnel = null
    this.tunnelLocation = null
    if (type === 'VENTE') {
      this.f.type.setValue(type)
      this.tunnelService.getList('VENTE').subscribe((res: any)=> {
        this.tunnel = res[0];
        this.editForm()
      }, error => {});

    } else if (type === 'LOCATION') {
      this.f.type.setValue(type)
      this.tunnelService.getList('LOCATION').subscribe((res: any)=> {
        this.tunnelLocation = res[0];
        this.editForm()
      }, error => {});
    } else if (type === 'CONFIGURATION') {
      this.f.type.setValue(type)
      this.userService.getList().subscribe((res: any)=> {
      this.users = res;
      console.log(this.users);

    },
       error => {}
       );
    }else if (type === 'ETAPE') {
      this.etapeService.getList().subscribe((res: any)=> {this.etapesRow = res}, error => {});
    }

  }

  get f() { return this.form.controls }
  get etapes() { return this.form.get('etapes') as FormArray; }
  get removes() { return this.form.get('removes') as FormArray; }
}
