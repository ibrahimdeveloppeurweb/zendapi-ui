import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ResponseService } from '@service/response/response.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploaderService } from '@service/uploader/uploader.service';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { FundRequest } from '@model/fund-request';
import { ProspectionService } from '@service/prospection/prospection.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { ReservationService } from '@service/reservation/reservation.service';


@Component({
  selector: 'app-response-add',
  templateUrl: './response-add.component.html',
  styleUrls: ['./response-add.component.scss']
})
export class ResponseAddComponent implements OnInit {
  ESCAPE_KEYCODE = 27;
  form: FormGroup;
  submit = false;
  edit: boolean = false;
  status = 'VENTE';
  type = '';
  response='any';
  title: string;
  fundRequest: FundRequest;
  prospect: any;
  prospectSelected: any;
  statutRow = [
    {label: 'Traitement éffectué', value: 'Traitement éffectué'},
    {label: 'Non traité', value: 'Non traité'}
   
  ]

  disponibiliteRow = [
    {label: 'Disponible', value: 'Disponible'},
    {label: 'Non disponible', value: 'Non disponible'}
   
  ]
  evaluationRow = [
    {label: 'Favorable', value: 'Favorable'},
    {label: 'Non Favorable', value: 'Non favorable'}
   
  ]

  bienRow = [
    {label: 'Oui', value: 'Oui'},
    {label: 'Non ', value: 'non'}
   
  ]



  ActionSelected: any
  reservation: any;

  constructor(
    public modal: NgbActiveModal,
    private emitter: EmitterService,
    public toastr: ToastrService,
    public responseService: ResponseService,
    private formBuild: FormBuilder,
    public uploadService: UploaderService,
    private prospectService: ProspectionService,
    private ReservationService:ReservationService
    

  ) { 
    
    this.newForm()
  }

  ngOnInit(): void {
    
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      parent: [null],
      prospect: [null],
      status: [this.status],
      date: [null],
      dateL: [null],
      mode: [null],
      type: [null],
      min: [0],
      max: [0],
      apport: [0],
      folderUuid: [null],
      commentaire: [null],
      evaluation : [null],
     reservation : [null],
      folders: this.formBuild.array([])
    })
  }
  editForm(){
    if (this.edit) {
      const data = {...this.responseService.getResponse()};
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.dateL = DateHelperService.fromJsonDate(data?.dateL);
      this.form.patchValue(data);
      data?.options.forEach((item) => {
        this.options.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            choix: [item.choix, [Validators.required]],
            offre: [item.offreUuid, [Validators.required]],
          })
        );
      });
      this.prospect = data.prospect
      this.prospectSelected = data.prospect
      this.setProspectUuid(data.prospect.uuid)
    }
  }
  setProspectUuid(uuid) {
    if(uuid){
      this.f.prospect.setValue(uuid);
      this.loadProspect();
    } else {
      this.prospect = null;
      this.f.prospect.setValue(null);
    }
  }
  loadProspect() {
    this.emitter.disallowLoading();
    this.prospectService.getSingle(this.f.prospect.value).subscribe((res: any) => {
      this.prospect = res;
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
  
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
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
  


onSubmit() {
  this.submit = true;
  this.emitter.loading();
  if (this.form.valid) {
    const data = this.form.getRawValue();
    this.responseService.add(data).subscribe(
      res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit ? 'RESPONSE_UPDATED' : 'RESPONSE_ADD', payload: res?.data });
        }
        this.emitter.stopLoading();
      },
      error => { });
  } 
}

onReset(){

}

get f(): any { return this.form.controls; }
get file() { return this.form.get('files') as FormArray; }
get folder() { return this.form.get('folders') as FormArray; }
get options() { return this.form.get('options') as FormArray; }
}
