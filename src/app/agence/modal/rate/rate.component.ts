import { Component, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  i: number = 0
  user: any
  form: FormGroup

  constructor(
    private auth: AuthService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) { 
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.newForm()
    this.f.uuid.setValue(this.user.uuid)
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      verif: ['note'],
      isRate: [true],
      note: [0]
    });
  }
  onStar(number){
    this.i = number
    this.f.note.setValue(this.i)
  }
  onSubmit(){
    this.userService.updateRate(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.modal.close('ferme');
        this.authService.setRateToken(res)
      }
    });
  }
  onClose(){
    this.modal.close('ferme');
    this.userService.updateRate(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.modal.close('ferme');
      }
    });
  }
  get f() { return this.form.controls; }
}
