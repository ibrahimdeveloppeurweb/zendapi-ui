import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { HouseCoService } from '@service/syndic/house-co.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-infrastructure-add',
  templateUrl: './infrastructure-add.component.html',
  styleUrls: ['./infrastructure-add.component.scss']
})
export class InfrastructureAddComponent implements OnInit {

  form: FormGroup
  edit: boolean = false
  title: string = ''
  submit: boolean = false
  infrastructure: any
  currentSyndic: any
  currentLot: any
  lots: any
  agency = Globals.user.agencyKey
  years = []
  etats = [
    {label: 'En service', value: 'EN SERVICE'},
    {label: 'Hors service', value: 'HORS SERVICE'},
  ]

  types = [
    {label: 'Ascenseur', value: 'ASCENSEUR'},
    {label: 'Partie commune', value: 'PARTIE COMMUNE'},
    {label: 'Parking', value: 'PARKING'},
    {label: 'Jardin', value: 'JARDIN'},
    {label: 'Piscine', value: 'PISCINE'},
    {label: 'Aire de jeux', value: 'AIRE DE JEUX'}
  ]
  syndics: any[] = []

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private syndicService: SyndicService,
    private infrastructureService: InfrastructureService,
    private homeCoService: HomeCoService,
    private coproprieteService: CoproprieteService,
    public uploadService: UploaderService,
  ) {
    this.edit = this.infrastructureService.edit
    this.infrastructure = this.infrastructureService.getInfrastructure()
    const code = this.infrastructure ? this.infrastructure?.code : null
    this.title = (!this.edit) ? 'Ajouter une nouvelle infrastructure' : 'Modifier l\'infrastructure ' + code;
    this.getListSyndic()
    this.newForm()
    if(this.infrastructureService.type === 'SYNDIC'){
      this.f.syndic.setValue(this.infrastructureService.uuidSyndic)
      this.getHouseCo(this.infrastructureService.uuidSyndic)
      this.infrastructureService.type = null
      this.infrastructureService.uuidSyndic = null
    }
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      syndic: [null, [Validators.required]],
      nom: [null, [Validators.required]],
      type: [null, [Validators.required]],
      hauteur: [0, [Validators.required]],
      superficie: [0, [Validators.required]],
      description: [null],
      etat: ['EN SERVICE'],
      folderUuid: [null],
      lot: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([])
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.infrastructureService.getInfrastructure()};
      this.form.patchValue(data);
      this.getHouseCo(data?.trustee?.uuid)

      data.houseCo = data.houseCo ? data.houseCo.uuid : null
      data.homeCo = data.homeCo ? data.homeCo.uuid : null
      this.f.folderUuid.setValue(data?.folder?.uuid);

      if(data.houseCo){
        this.f.lot.setValue(data.houseCo)
      }else if(data.homeCo){
        this.f.lot.setValue(data.homeCo)
      }

      this.currentSyndic = {
        title: data.trustee ? data?.trustee?.nom : null,
        detail: data?.trustee ? data?.trustee?.nom : null
      }

      data.trustee = data?.trustee ? data?.trustee?.uuid : null
      this.f.etat.setValue(data?.etat)
      this.f.superficie.setValue(data?.superficie)
      this.f.syndic.setValue(data?.trustee)
    }
  }

  getListSyndic(){
    this.syndicService.getList(null).subscribe((res : any) => {
      return this.syndics = res
    })
  }

  setSyndicUuid(uuid){
    if(uuid){
      this.getHouseCo(uuid)
    }
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.infrastructureService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          this.modal.close('INFRASTRUCTURE');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'INFRASTRUCTURE_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'INFRASTRUCTURE_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })
    }
  }

  getHouseCo(uuid){
    this.homeCoService.getList(uuid).subscribe((res: any) => {
      return this.lots = res
    })
  
  }

  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
  }
  files(data) {
    if (data && data !== null) {
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
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
