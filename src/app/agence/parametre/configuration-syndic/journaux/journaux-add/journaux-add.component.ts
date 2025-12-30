import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JournauxService } from '@service/configuration/journaux.service';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-journaux-add',
  templateUrl: './journaux-add.component.html',
  styleUrls: ['./journaux-add.component.scss']
})
export class JournauxAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  visibleAjout = false
  visibleButton = true
  visibleTable = true
  dtOptions: any = {};
  submit = false
  natures: any[] = []
  currentSyndic: any
  edit: boolean = false;
  agency = Globals.user.agencyKey
  journal: any
  advance: boolean = false
  trustees:  any[] = []


  constructor(
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private journauxService: JournauxService,
    public modal: NgbActiveModal,
    private syndicService: SyndicService
  ) {
    this.edit = this.journauxService.edit
    this.journal = this.journauxService.getJournaux()
    this.journauxService.getNature().subscribe((res: any) => {
      this.natures = res
    })
    this.syndicService.getList(this.agency).subscribe((res: any) => {
      console.log(res)
      if (res) {
        this.trustees =  res
      }
    })
    this.title = (!this.edit) ? 'Ajouter un nouveau journal' : 'Modifier le journal ';
    this.newForm()
   }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.editForm()
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      nature: [],
      libelle: [null, [Validators.required]],
      code: [null, [Validators.required]],
      agency: [this.agency],
      trustee: [null, [Validators.required]],
    })
  }

  editForm(){
    this.advance = false
    if (this.edit) {
      const data = {...this.journauxService.getJournaux()};
      data.nature = data.nature ? data.nature.uuid : null
      if(data.nature){
        this.journauxService.getNature().subscribe((res: any) => {
          this.natures = res
        })
      }
      this.form.patchValue(data);
      this.f.nature.setValue(data.nature)
    }
  }

  natureChange(){
    this.f.nature.reset()
    this.advance = !this.advance
    if(this.advance === false){
      this.journauxService.getNature().subscribe((res: any) => {
        if(res[0]){
          this.f.nature.setValue(res[0].uuid)
        }else{
          this.natures = res
        }
      })
    }
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.journauxService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'TVA_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'TVA_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })    
    }
  }

  get f(): any { return this.form.controls; }

}
