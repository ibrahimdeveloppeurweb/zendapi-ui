import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { User } from '@model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from '@service/agent/agent.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { UserService } from '@service/user/user.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.scss']
})
export class EtapeComponent implements OnInit {

  title = null;
  type = '';
  edit: boolean = false;
  activity: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  prospect: any
  users: User[] = []
  etapeRow = []

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private userService: UserService,
    private agentService: AgentService,
    public uploadService: UploaderService,
    private prospectService: ProspectionService
  ) { 
    this.prospect = this.prospectService.getProspection()
    this.type = this.agentService.typeAssignattion
    this.userService.getList().subscribe(res => {
      if(res){
        this.users = res
      }
    })
    this.newForm()
  }

  ngOnInit(): void {
  }
  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      user: [null, [Validators.required]],
      prospect: [this.prospect.uuid, [Validators.required]]
    })
  }

  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      if (this.type === 'PROSPECT') {
        this.prospectService.assigner(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.modal.dismiss();
              this.modal.close('ferme');
              this.emitter.emit({ action: 'PROSPECT_UPDATE', payload: res?.data });
            }
            this.emitter.stopLoading();
          },
        error => { });
      }else{
        this.prospectService.abonner(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.modal.dismiss();
              this.modal.close('ferme');
              this.emitter.emit({ action: 'PROSPECT_UPDATE', payload: res?.data });
              Swal.fire('', "L'abonnement a été éffectuée avec succès !", 'success');
            }
            this.emitter.stopLoading();
          },
        error => { });
      }
    } else {
      this.emitter.stopLoading();
      return;
    }
  }

  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }

  get f(): any { return this.form.controls; }
}
