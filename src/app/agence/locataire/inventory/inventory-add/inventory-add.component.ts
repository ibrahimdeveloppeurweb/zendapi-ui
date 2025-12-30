import {Contract} from '@model/contract';
import {ToastrService} from 'ngx-toastr';
import {Inventory} from '@model/inventory';
import { Globals } from '@theme/utils/globals';
import {Component, HostListener, Input, OnInit} from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {ContractService} from '@service/contract/contract.service';
import {InventoryService} from '@service/inventory/inventory.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UploaderService } from '@service/uploader/uploader.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from '@env/environment';
import { EquipmentService } from '@service/equipment/equipment.service';
import { Equipment } from '@model/equipment';
import { InventoryModelService } from '@service/inventory-model/inventory-model.service';
import { FolderService } from '@service/folder/folder.service';


@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss']
})
export class InventoryAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  type = '';
  formS: FormGroup;
  form: FormGroup;
  submit = false;
  edit = false;
  customer = false;
  inventory: Inventory;
  contract: any;
  tenant?: string;
  tenantSelected?: any;
  homeTypeSelected: any;
  modelSelected: any;
  models: any[] = [];
  contracts: Array<any> = [];
  equipments: Array<Equipment> = [];
  required = Globals.required;
  typeRow = [
    {label: 'ENTREE', value: 'ENTREE'},
    {label: 'SORTIE', value: 'SORTIE'}
  ];
  etatRow = [
    {label: 'Bon état', value: 'BON'},
    {label: 'Intermédiaire', value: 'INTERMEDIAIRE'},
    {label: 'Mauvais état', value: 'MAUVAIS'}
  ];
  file: any;
  publicUrl = environment.publicUrl;
  removes = [];
  @Input() maxSize: number = 3;
  imageTypes = ['image/png', 'image/x-png', 'image/pjpeg', 'image/jpg', 'image/jpeg', 'image/gif'];
  base64Image: any;
  @Input() typeFile = [
    'image/png', 'image/x-png', 'image/pjpeg', 'image/jpg', 'image/jpeg', 'image/gif',
    'application/octet-stream', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/excel', 'application/msexcel', 'application/x-msexcel', 'application/x-ms-excel', 'application/x-excel',
    'application/x-dos_ms_excel', 'application/xls', 'application/x-xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    public emitter: EmitterService,
    private folderService: FolderService,
    public uploadService: UploaderService,
    public contractService: ContractService,
    private inventoryService: InventoryService,
    private equipmentService: EquipmentService,
    private permissionsService: NgxPermissionsService,
    private inventoryModelService: InventoryModelService,
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.edit = this.inventoryService.edit;
    this.customer = this.inventoryService.customer;
    this.inventory = this.inventoryService.getInventory();
    this.title = (!this.edit) ? 'Ajouter un etat des lieux' : 'Modifier l\'etat des lieux ';
    this.inventoryModelService.getList().subscribe((res) => {
    this.models = res;
    
  });
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
    
  }

  newForm() {
    this.inventoryService.edit = false;
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      folderUuid: [null],
      observation: [null],
      isCustomer: [this.customer],
      date: [null, Validators.required],
      type: [null,Validators.required],
      tenant: [null, Validators.required],
      homeType: [null],
      contract: [null, [Validators.required]],
      model: [null],
      folders: this.formBuild.array([]),
      pieces: this.formBuild.array([])
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.inventoryService.getInventory()};
      this.setCurrentTenant(data?.contract?.tenant);
      data.date = DateHelperService.fromJsonDate(data.date);
      data.contract = data?.contract?.uuid;
      data.pieces.forEach((piece) => {
        let options = this.formBuild.array([]);
        piece.options.forEach((x) => {
          options.push(
            this.formBuild.group({
              uuid: [x?.uuid],
              id: [x?.id],
              etat: [x?.etat, [Validators.required]],
              qte: [x?.qte, [Validators.required]],
              equipment: [x?.equipment?.uuid, [Validators.required]],
              equipmentSelected: [{title: x?.equipment.searchableTitle, detail: x?.equipment.searchableDetail}],
              description: [x?.description]
            })
          )
        })
        this.pieces.push(
          this.formBuild.group({
            id: [piece?.id],
            uuid: [piece?.uuid],
            libelle: [piece?.libelle, [Validators.required]],
            options: options
          })
        )
      });
      data.pieces = this.pieces.getRawValue();
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
    }
  }
  setTenantUuid(uuid) {
    this.tenant = uuid;
    this.f.tenant.setValue(uuid);
    
    if (!this.edit) { this.loadContracts(); }
    if (!uuid) {
       console.log("this.f.tenant",this.f.tenant.value);
       this.form.reset()
    }
  }
  loadContracts() {
    this.contracts = [];
    this.f.contract.setValue(null);
    if (this.f.tenant.value) {
      if (!this.customer) {
        this.contractService.getList(this.f.tenant.value, 'ACTIF').subscribe((res) => {
          this.contracts = res;
        });
      }else {
        this.folderService.getList(this.f.tenant.value, 'ACTIF').subscribe((res) => {
          this.contracts = res;
        });
      }
    }
  }
  setContratUuid(event) {
    if (event.target.value !== null) {
      this.contract = this.contracts.find(item => {
        if (item.uuid === event.target.value) {
          this.f.contract.setValue(item.uuid);
          return item;
        } else {
          this.contracts = [];
          this.f.contract.setValue(null);
        }
      });
    }
  }
  setCurrentTenant(tenant) {
    this.setTenantUuid(tenant?.uuid);
    this.tenantSelected = {
      photoSrc: tenant?.photoSrc,
      title: tenant?.searchableTitle,
      detail: tenant?.searchableDetail
    };
  }
  setCurrentHomeType(type){
    this.setHomeTypeUuid(type?.uuid);
    this.homeTypeSelected = {
      photoSrc: type?.photoSrc,
      title: type?.searchableTitle,
      detail: type?.searchableDetail
    };
  }
  setHomeTypeUuid(uuid){
    if(uuid){
      this.f.homeType.setValue(uuid);
    } else {
      this.f.homeType.setValue(null);
    }
    this.setInventoryModels(uuid);
  }

  setInventoryModels(homeTypeUuid) {
    this.models = null;
    this.inventoryModelService.getList(homeTypeUuid).subscribe(res => {
      this.models = res;
    })
  }
  setHomeTypeModellUuid() {
    const contract =this.form.get('contract').value;
    if (contract) {
      this.contractService.getSingl(contract).subscribe((res) => {
      if (res) {
        if (res?.rental?.house?.typeBien?.inventoryModel) {
          this.f.model.setValue(res?.rental?.house?.typeBien?.inventoryModel?.uuid);
        }
      }
       
    });
    }else {
      this.form.reset()
    }
 
    
  }
  setModelUuid() {
    const model =this.form.get('model').value;   
    console.log(model);
    this.inventoryModelService.getSingle(model).subscribe(res => {
      this.modelSelected = res;
      if(this.modelSelected) {
        this.initPieceForm(this.modelSelected);
      }
    })

  }

  initPieceForm(model) {
    this.pieces.controls = [];
    if(model.pieces) {
      model.pieces.forEach((piece) => {
        let options = this.formBuild.array([]);
        piece.options.forEach((x) => {
          options.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              etat: [null, [Validators.required]],
              qte: [0, [Validators.required]],
              equipment: [x?.equipment?.uuid, [Validators.required]],
              equipmentSelected: [{title: x?.equipment.searchableTitle, detail: x?.equipment.searchableDetail}],
              description: [null],
              file: [null],
              files: this.formBuild.array([]),
            })
          )
        })
        this.pieces.push(
          this.formBuild.group({
            id: [piece?.id],
            uuid: [piece?.uuid],
            libelle: [piece?.libelle, [Validators.required]],
            options: options
          })
        )
      });
    }
  }
  setEquipmentUuid(uuid, row){
    if(uuid){
      row.get('equipment').setValue(uuid);
    } else {
      row.get('equipment').setValue(null);
    }
  }

  async uploadFiles(prop, files?: any[]) {
    const promises = [];
    let base64String = null;
    let src = null;
    let array = [];
    for (const file of files) {
      const promise = new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          base64String = reader.result.toString().split(',')[1];
          src = reader.result as string;
          const object = {
            id: null,
            uuid: null,
            name: file.name,
            size: file.size,
            type: file.type,
            src: src
          }
          array.push(object)
          resolve();
        };
        reader.onerror = () => {
          reject('Erreur lors de la lecture du fichier.');
        };
        reader.readAsDataURL(file);
      });
      promises.push(promise);
    }
    Promise.all(promises)
      .then(() => {
        array.forEach(item => {
          prop.get('files').push(
            this.formBuild.group({
              uuid: [item?.uuid],
              name: [item?.name],
              size: [item?.size],
              type: [item?.type],
              src: [item?.src]
            })
          );
        });
      })
      .catch(error => {
      });
  }
  setFolderUuid(uuid) {
    this.form.get('folderUuid').setValue(uuid);
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.inventoryService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'INVENTORY_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'INVENTORY_ADD', payload: res?.data});
          }
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
  onAddPiece() {
    return this.pieces.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        options: this.formBuild.array([
          this.formBuild.group({
            uuid: [null],
            id: [null],
            qte: [0, [Validators.required]],
            equipment: [null, [Validators.required]],
            equipmentSelected: [null],
            etat: [null, [Validators.required]],
            description: [null],
            file: [null],
            files: this.formBuild.array([]),
          })
        ]),
      })
    );
  }
  onAddEquipement(piece, count: number) {
    for (let i = 0; i < count; i++) {
      // @ts-ignore
      this.pieces.at(piece).get('options').push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          equipment: [null, [Validators.required]],
          equipmentSelected: [null],
          etat: [null, [Validators.required]],
          description: [null],
          file: [null],
          files: this.formBuild.array([]),
        })
      );
    }
  }
  onDeletePiece(row) {
    this.pieces.removeAt(row);
  }
  onDupliquerPiece(row) {
    let options = this.formBuild.array([]);
    row.get('options').controls.forEach((x) => {
      options.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          etat: [x?.get('etat').value, [Validators.required]],
          qte: [x?.get('qte').value, [Validators.required]],
          equipment: [x?.get('equipment').value, [Validators.required]],
          equipmentSelected: [x?.get('equipmentSelected').value],
          description: [x?.get('description').value],
          file: [null],
          files: this.formBuild.array([]),
        })
      )
    })
    this.pieces.push(
      this.formBuild.group({
        id: [null],
        uuid: [null],
        libelle: [row?.get('libelle').value, [Validators.required]],
        options: options
      })
    )
  }
  onSavePiece(index, item){
    var array = [];
    if (this.removes.length > 0) {
      this.removes.forEach(item => {
        if (item.piece === index && item.uuid !== null) {
          array.push(item.uuid)
        }
      });
    }
    this.formS = this.formBuild.group({
      id: [this.f.id.value],
      uuid: [this.f.uuid.value],
      contract: [this.f.contract.value, [Validators.required]],
      date: [this.f.date.value, Validators.required],
      tenant: [this.f.tenant.value, Validators.required],
      type: [this.f.type.value, Validators.required],
      pieces: this.formBuild.array([]),
      observation: [this.f.observation.value],
      folderUuid: [null],
      removes: [array],
      folders: this.formBuild.array([]),
    });
    this.savePieces.push(item);

    if (item.valid) {
      const data = this.formS.getRawValue();
      this.inventoryService.createByPiece(data).subscribe(res => {
        if (res?.status === 'success') {
          this.updatePiece(item, res.data)
        }
      });
    }
  }
  updatePiece(row, data) {
    this.f.id.setValue(data?.id);
    this.f.uuid.setValue(data?.uuid);
  
    row?.get('id').setValue(data?.piece?.id);
    row?.get('uuid').setValue(data?.piece?.uuid);
  
    let options = this.formBuild.array([]);
    data?.piece?.options.forEach(item => {
      options.push(
        this.formBuild.group({
          uuid: [item?.uuid],
          id: [item?.id],
          etat: [item?.etat, [Validators.required]],
          qte: [item?.qte, [Validators.required]],
          equipment: [item?.equipment?.uuid, [Validators.required]],
          equipmentSelected: [{ title: item?.equipment.searchableTitle, detail: item?.equipment.searchableDetail }],
          description: [item?.description]
        })
      );
    });
    
    row.setControl('options', options); // Utilisation de setControl au lieu de setValue
  }
  onDelete(room, equipment, item) {
    this.removes.push({piece: room, equipment: item.get('uuid').value});
    // @ts-ignore
    this.pieces.at(room).get('options').removeAt(equipment);
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
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploadService.setDataFileByFolder('');
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }

  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'etat_lieux'}
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
    }
  }
  toast(msg, title, type) {
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
  get f() { return this.form.controls; }
  get pieces() { return this.form.get('pieces') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get savePieces() { return this.formS.get('pieces') as FormArray; }
}
