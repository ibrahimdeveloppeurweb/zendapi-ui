import {Contract} from '@model/contract';
import {ToastrService} from 'ngx-toastr';
import {Inventory} from '@model/inventory';
import { Globals } from '@theme/utils/globals';
import {Component, HostListener, Input, OnInit} from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
import { HomeTypeService } from '@service/home-type/home-type.service';
import { HomeType } from '@model/home-type';
import { InventoryModelService } from '@service/inventory-model/inventory-model.service';
import { InventoryModel } from '@model/inventory-model';


@Component({
  selector: 'app-inventory-model-add',
  templateUrl: './inventory-model-add.component.html',
  styleUrls: ['./inventory-model-add.component.scss']
})

export class InventoryModelAddComponent implements OnInit {
  title: string = '';
  saveForm: FormGroup;
  form: FormGroup;
  submit = false;
  edit = false;
  removes = [];
  typeBienSelected: any;
  inventoryModel: InventoryModel;
  homeTypes: HomeType[] = [];
  required = Globals.required;
  publicUrl = environment.publicUrl;
  

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    public emitter: EmitterService,
    private homeTypeService: HomeTypeService,
    private modelService: InventoryModelService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.edit = this.modelService.edit;
    this.inventoryModel = this.modelService.getInventoryModel();
    this.title = (!this.edit) ? "Ajouter un model d'etat des lieux" : "Modifier le model d'etat des lieux";
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  /**
   * Formulaire d'ajout
   */
  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      type: [null, [Validators.required]],
      pieces: this.formBuild.array([])
    });
  }

  /**
   * Formulaire dde modification
   */
  editForm() {
    if (this.edit) {
      const data = {...this.modelService.getInventoryModel()};
      console.log(data);
      data.pieces.forEach((piece) => {
        let options = this.formBuild.array([]);
        piece.options.forEach((x) => {
          options.push(
            this.formBuild.group({
              uuid: [x?.uuid],
              id: [x?.id],
              equipment: [x?.equipment?.uuid, [Validators.required]],
              equipmentSelected: [{title: x?.equipment.searchableTitle, detail: x?.equipment.searchableDetail}],
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
      this.setCurrentHomeType(data?.type);
    }
  }

  /**
   * Type de maison courant
   * @param type 
   */
  setCurrentHomeType(type){
    this.setTypeBienUuid(type?.uuid);
    this.typeBienSelected = {
      photoSrc: type?.photoSrc,
      title: type?.searchableTitle,
      detail: type?.searchableDetail
    };
  }

  /**
   * Selection du type de maison
   * @param uuid 
   */
  setTypeBienUuid(uuid){
    if(uuid){
      this.f.type.setValue(uuid);
    } else {
      this.f.type.setValue(null);
    }
  }

  /**
   * Ajout de la ligne de piece
   * @returns 
   */
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
            equipment: [null, [Validators.required]],
            equipmentSelected: [null],
          })
        ]),
      })
    );
  }

  /**
   * Ajout d'equipement liés a la pieces
   * @param piece 
   * @param count 
   */
  onAddEquipement(piece, count: number) {
    for (let i = 0; i < count; i++) {
      // @ts-ignore
      this.pieces.at(piece).get('options').push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          equipment: [null, [Validators.required]],
          equipmentSelected: [null],
        })
      );
    }
  }

  /**
   * Suppression de ligne de piece
   * @param row Ligne a supprimer
   */
  onDeletePiece(row) {
    this.pieces.removeAt(row);
  }

  /**
   * Dupliquer la ligne de pieces
   * @param row Ligne a dupliqué
   */
  onDupliquerPiece(row) {
    let options = this.formBuild.array([]);
    row.get('options').controls.forEach((x) => {
      options.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          equipment: [x?.get('equipment').value, [Validators.required]],
          equipmentSelected: [x?.get('equipmentSelected').value]
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

  /**
   * Enregistrer la pièce
   * @param index 
   * @param item 
   */
  onSavePiece(index, item){
    var array = [];
    if (this.removes.length > 0) {
      this.removes.forEach(item => {
        if (item.piece === index && item.uuid !== null) {
          array.push(item.uuid)
        }
      });
    }
    this.saveForm = this.formBuild.group({
      id: [this.f.id.value],
      uuid: [this.f.uuid.value],
      type: [this.f.type.value, Validators.required],
      pieces: this.formBuild.array([]),
      removes: [array],
    });
    this.savePieces.push(item);

    if (item.valid) {
      const data = this.saveForm.getRawValue();
      this.modelService.createByPiece(data).subscribe(res => {
        if (res?.status === 'success') {
          this.updatePiece(item, res.data)
        }
      });
    }
  }

  /**
   * Modificatioon de piece
   * @param row 
   * @param data 
   */
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
          equipment: [item?.equipment?.uuid, [Validators.required]],
          equipmentSelected: [{ title: item?.equipment.searchableTitle, detail: item?.equipment.searchableDetail }],
        })
      );
    });
    
    row.setControl('options', options); // Utilisation de setControl au lieu de setValue
  }

  setEquipmentUuid(uuid, row){
    if(uuid){
      row.get('equipment').setValue(uuid);
    } else {
      row.get('equipment').setValue(null);
    }
  }

  onDeleteEquipement(room, equipment, item) {
    this.removes.push({piece: room, equipment: item.get('uuid').value});
    // @ts-ignore
    this.pieces.at(room).get('options').removeAt(equipment);
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
    if (!this.form.invalid) {
      const data = this.form.getRawValue();

      this.modelService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'INVENTORY_MODEL_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'INVENTORY_MODEL_ADD', payload: res?.data});
          }
        }
      });
    } else { return; }
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset(){
    this.form.reset()
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
  get savePieces() { return this.saveForm.get('pieces') as FormArray; }
}
