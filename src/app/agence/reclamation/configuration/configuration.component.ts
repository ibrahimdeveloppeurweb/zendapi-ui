import { Category } from '@model/category';
import { Procedure } from '@model/procedure';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from '@service/user/user.service';
import { SettingService } from '@service/setting/setting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@service/category/category.service';
import { ProcedureService } from '@service/procedure/procedure.service';
import { GestionnaireService } from '@service/gestionnaire/gestionnaire.service';
import { EmitterService } from '@service/emitter/emitter.service';

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
  type: string = "CONFIGURATION"
  chefSelected: any;
  categories: Category[] = [];
  procedures: Procedure[] = [];
  gestionnaires: any[] = [];
  users:  [];

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private settingService: SettingService,
    private categoryService: CategoryService,
    private procedureService: ProcedureService,
    private permissionsService: NgxPermissionsService,
    private gestionnaireService: GestionnaireService,
    private emitter: EmitterService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.newForm(),
    this.settingService.getChef().subscribe(res => {
      this.form.get('user').setValue(res.uuid)
      return res ? this.chefSelected = res.uuid : null
    })

    this.gestionnaireService.getList().subscribe(res => {
      return this.gestionnaires = res 
    })
    this.editForm()
  }

  ngOnInit(): void {
    this.userService.getList().subscribe((res: any)=> {
      this.users = res;
    });
    this.emitter.event.subscribe((data) => {
      if (data.action === 'GESTIONNAIRE_ADD') {
        this.appendToList(data.payload);
      }
    
    });
  }

  appendToList(item): void {
    this.gestionnaires.unshift(item);
  }

  newForm() {
    this.form = this.formBuild.group({
      users: [null, [Validators.required]]
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
        this.send()
      }
    });
  }
  send() {
    this.gestionnaireService.add(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.gestionnaireService.getList().subscribe(res => {
          return this.gestionnaires = res 
        })
        this.form.reset()
        this.emitter.stopLoading()
      }
   
    }, error => {});
  }

  show(item) {
 
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
        this.gestionnaireService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.gestionnaireService.getList().subscribe(res => {
              return this.gestionnaires = res 
            })
          }
        });
      }
    });
  }

  onDisplay(type: string) {
    this.type = type;
    if (type === 'CONFIGURATION') {
      this.editForm()
    this.gestionnaireService.getList().subscribe(res => {
      return this.gestionnaires = res 
    })
    } else if (type === 'CATEGORIE') {
      this.categoryService.getList().subscribe((res: any)=> {
        this.categories = res;
      }, error => {});
    } else if (type === 'PROCEDURE') {
      this.procedureService.getList().subscribe((res: any)=> {
        this.procedures = res;
        } , error => {}
      );
    }

  }
  get f() { return this.form.controls }
}
