import { Famille } from '@model/famille';
import { SousFamille } from '@model/sous-famille';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from '@service/user/user.service';
import { SettingService } from '@service/setting/setting.service';
import { FamilleService } from '@service/famille/famille.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SousFamilleService } from '@service/sousFamille/sous-famille.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  frais: any;
  form: FormGroup;
  title: string = ""
  edit: boolean = false;
  type: string = "FAMILLE"
  chefSelected: any;
  familles: Famille[] = [];
  sousFamilles: SousFamille[] = [];
  users:  [];

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private settingService: SettingService,
    private familleService: FamilleService,
    private sousService: SousFamilleService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.newForm(),
    this.settingService.getChef().subscribe(res => {
      this.form.get('user').setValue(res.uuid)
      return res ? this.chefSelected = res.uuid : null
    })
    this.editForm()
    this.onDisplay(this.type)
  }

  ngOnInit(): void {
    this.onDisplay(this.type)
    // this.userService.getList().subscribe((res: any)=> {
    //   this.users = res;
    // })
  }

  newForm() {
    this.form = this.formBuild.group({
      user: [null, [Validators.required]]
    });
  }
  editForm() {
    // this.form.reset();
    // const data = {...this.settingLocation};
    // this.form.patchValue(data);
  }
  onSubmit() {
    let text = "Voulez-vous vraiment enregistrer le Gestionnaire des tickets ?";
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
        this. send()
      }
    });
  }
  send() {
    this.settingService.createTicket(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.edit = false
        this.editForm()
      }
    }, error => {});
  }

  onDisplay(type: string) {
    this.type = type;
    if (type === 'CONFIGURATION') {
      this.editForm()
    } else if (type === 'FAMILLE') {
      this.familleService.getList().subscribe((res: any)=> {
        this.familles = res;
      }, error => {});
    } else if (type === 'SOUS') {
      this.sousService.getList().subscribe((res: any)=> {
        this.sousFamilles = res;
        } , error => {}
      );
    }

  }
  get f() { return this.form.controls }
}
