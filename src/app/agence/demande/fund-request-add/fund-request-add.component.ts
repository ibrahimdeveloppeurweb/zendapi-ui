import { Treasury } from '@model/treasury';
import { Globals } from '@theme/utils/globals';
import { Component, HostListener, OnInit } from '@angular/core';
import { FundRequest } from '@model/fund-request';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploaderService } from '@service/uploader/uploader.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-fund-request-add',
  templateUrl: './fund-request-add.component.html',
  styleUrls: ['./fund-request-add.component.scss']
})
export class FundRequestAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = ""
  edit: boolean = false
  fundRequest: FundRequest
  treasuries: Treasury[]
  form: FormGroup
  submit: boolean = false
  currentFund?: any;
  required = Globals.required
  user = Globals.user
  typeRow = [
    { label: "CAISSE", value: "CAISSE" },
    { label: "BANQUE", value: "BANQUE" },
  ]
  prioriteRow = [
    {label: 'NON PRIORITAIRE', value: 'NON'},
    {label: 'PRIORITE MOYEN', value: 'MOYEN'},
    {label: 'URGENT', value: 'URGENT'}
  ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    public treasuryService: TreasuryService,
    public fundRequestService: FundRequestService
  ) {
    this.edit = this.fundRequestService.edit
    this.fundRequest = this.fundRequestService.getFundRequest()
    this.title = (!this.edit) ? "Ajouter une demande de fond" : "Modifier la demande de "+this.fundRequest.code
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      folderUuid: [null],
      motif: [null, [Validators.required]],
      priorite: [null, [Validators.required]],
      date: [null, [Validators.required]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      treasury: [null, [Validators.required]],
      details: [null],
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.fundRequestService.getFundRequest() }
      this.currentFund ={
        photoSrc: data?.treasury?.photoSrc,
        title: data?.treasury?.nom,
      };
      this.form.patchValue(data)
      this.f.folderUuid.setValue(data?.folder?.uuid);
    }
  }
  setTreasuryUuid(uuid): void {
    this.f.treasury.setValue(uuid);
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.fundRequestService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          this.emitter.emit({action: 'FUND_ADD', payload: res?.data});
        }
      });
    } else { return; }
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  files(data) {
    if(data && data !== null){
      data.forEach(item => {
        this.folder.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  upload(files) {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value) {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }

  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'demande'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset(){
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    }else{
      this.form.reset()
      this.form.controls['folderUuid'].setValue(null);
    }
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f() { return this.form.controls; }
  get folder() { return this.form.get('folders') as FormArray; }
}
