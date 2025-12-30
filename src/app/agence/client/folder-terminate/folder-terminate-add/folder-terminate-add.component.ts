import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { FolderTerminateService } from '@service/folder-terminate/folder-terminate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { FolderService } from '@service/folder/folder.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FolderTerminate } from '@model/folder-terminate';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '@model/customer';
import { Folder } from '@model/folder';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-folder-terminate-add',
  templateUrl: './folder-terminate-add.component.html',
  styleUrls: ['./folder-terminate-add.component.scss']
})
export class FolderTerminateAddComponent implements OnInit {
  title: string = ""
  form: FormGroup
  required = Globals.required
  global = {country: Globals.country, device: Globals.device}
  submit: boolean = false
  folders: Folder[]
  folder: Folder
  customer: Customer
  customerSelected: any
  edit: boolean = false
  terminate: FolderTerminate

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private folderService: FolderService,
    public terminateService: FolderTerminateService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ){
    this.edit = this.terminateService.edit;
    this.terminate = this.terminateService.getFolderTerminate();
    this.title = !this.edit ? 'Ajouter un nouvelle résiliation' : 'Modifier la résiliation du dossier N°'+this.terminate?.folder?.code;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      date: [null, [Validators.required]],
      signe: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      folder: [null, [Validators.required]],
      montantTtc: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montantHt: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montantTva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montantRemise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montantRendre: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montantDeduire: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      penalite: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.terminateService.getFolderTerminate() }
      this.setCustomerUuid(data?.folder?.customer?.uuid);
      this.customerSelected = {
        photoSrc: data?.folder?.customer?.photoSrc,
        title: data?.folder?.customer?.searchableTitle,
        detail: data?.folder?.customer?.searchableDetail
      };
      this.folder = data?.folder
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.folder = data?.folder?.uuid;
      // @ts-ignore
      data.montantRendre = data?.montant;
      // @ts-ignore
      data.montantDeduire = data?.montantAgence;
      data.penalite = data?.penalite;
      this.form.patchValue(data)
      this.onCalcul()
    }
  }
  setCustomerUuid(uuid) {
    if (uuid) {
      this.f.customer.setValue(uuid);
      if (!this.edit) {
        this.loadFolders(uuid)
      }
    } else {
      this.f.folder.setValue(null)
      this.customer = null
      this.folder = null
      this.folders = []
      this.onCalcul()
    }
  }
  loadFolders(uuid) {
    if(uuid) {
      this.folderService.getList(uuid, 'VALIDE').subscribe(res => {
        this.folders = res
      }, error => {})
    }
  }
  setFolder(uuid){
    if(!this.edit) {
      this.folder = this.folders.find(item => {
        if (item.uuid === uuid) {
          this.f.folder.setValue(uuid);
          return item;
        }
      });
      this.onCalcul();
    }
  }
  onCalcul(){
    if (this.folder) {
      var penalite = (this.folder?.montantBien * this.f.penalite.value) / 100;
      if(!this.edit) {
        this.f.signe.setValue(this.folder?.invoice?.paye < penalite ? 'NEGATIF' : 'POSITIF')
      }
      var totalDeduire = penalite;
      var totalRendre = this.f.signe.value === 'NEGATIF' ? penalite - this.folder?.invoice?.paye : this.folder?.invoice?.paye - penalite;
      var totalHt = totalRendre
      var totalTtc = totalRendre
      var totalTva = 0
      var totalRemise = 0
      this.f.montantDeduire.setValue(totalDeduire)
      this.f.montantRendre.setValue(totalRendre)
      this.f.montantHt.setValue(totalHt)
      this.f.montantTtc.setValue(totalTtc)
      this.f.montantTva.setValue(totalTva)
      this.f.montantRemise.setValue(totalRemise)
    } else {
      this.f.montantDeduire.setValue(0)
      this.f.montantRendre.setValue(0)
      this.f.montantHt.setValue(0)
      this.f.montantTtc.setValue(0)
      this.f.montantTva.setValue(0)
      this.f.montantRemise.setValue(0)
      this.f.penalite.setValue(0)
    }
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      this.terminateService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'FOLDER_TERMINATE_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'FOLDER_TERMINATE_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
    }
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
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  get f() { return this.form.controls; }
}
