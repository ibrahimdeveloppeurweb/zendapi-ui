import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@service/auth/auth.service';
import { CustomerService } from '@service/customer/customer.service';
import { OwnerService } from '@service/owner/owner.service';
import { TenantService } from '@service/tenant/tenant.service';
import { UserService } from '@service/user/user.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent implements OnInit {
  title: string = "";
  users: User[];
  form: FormGroup;
  submit: boolean = false
  required = Globals.required
  password = 'password';
  types = [
    { label: 'LOCATAIRE', value: 'LOCATAIRE' },
    { label: 'CLIENT', value: 'CLIENT' },
    { label: 'PROPRIÉTAIRE', value: 'PROPRIETAIRE' }
  ]
  entity: any = {
    class: 'Tenant',
    groups: 'tenant'
  };
  entitySelected: any = null;
  user: any = null;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private ownerService: OwnerService,
    private tenantService: TenantService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.title = "Actualiser les accès"
    this.newForm();
  }

  newForm(): void {
    this.form = this.formBuild.group({
      type: ['LOCATAIRE', [Validators.required]],
      user: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.form.get('type').valueChanges.subscribe(res => {
      this.form.get('user').setValue(null);
      if(res === 'LOCATAIRE') {
        this.entity = { class: 'Tenant', groups: 'tenant' };
      } else if(res === 'CLIENT') {
        this.entity = { class: 'Customer', groups: 'customer' };
      } else if(res === 'PROPRIETAIRE') {
        this.entity = { class: 'Owner', groups: 'owner' };
      }
    });
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.authService.actualiserPassword(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
          }
        });
    } else { return; }
  }

  setUserUuid(uuid) {
    if(uuid) {
      this.f.user.setValue(uuid);
      if(this.f.type.value === 'LOCATAIRE') {
        this.tenantService.getSingle(uuid).subscribe(res => {
          this.user = res;
          if(res) {
            this.f.username.setValue(res?.email);
          }
        });
      } else if(this.f.type.value === 'LOCATAIRE') {
        this.customerService.getSingle(uuid).subscribe(res => {
          this.user = res;
          if(res) {
            this.f.username.setValue(res?.email);
          }
          console.log(res);
        });
      } else if(this.f.type.value === 'PROPRIETAIRE') {
        this.ownerService.getSingle(uuid).subscribe(res => {
          this.user = res;
          if(res) {
            this.f.username.setValue(res?.email);
          }
          console.log(res);
        });
      }
    } else {
      this.f.user.setValue(null);
    }
  }

  setPassword(){
    const password = this.getRandomString(8);
    this.f.password.setValue(password);
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  get f() { return this.form.controls }

}
