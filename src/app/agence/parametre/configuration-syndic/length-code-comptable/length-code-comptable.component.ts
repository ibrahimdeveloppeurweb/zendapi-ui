import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '@service/configuration/general.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-length-code-comptable',
  templateUrl: './length-code-comptable.component.html',
  styleUrls: ['./length-code-comptable.component.scss']
})
export class LengthCodeComptableComponent implements OnInit {

  form: FormGroup;
  submit = false;
  currentSyndic: any
  agency = Globals.user.agencyKey
  settings: any

  constructor(
    private formBuild: FormBuilder,
    private generalService: GeneralService,
    private emitter: EmitterService,
    private syndicService: SyndicService
  ) { 
    this.generalService.getList(this.agency).subscribe((res: any) => {
      console.log(res)
      if(res[0]){
        this.settings = res[0]
        this.f.uuid.setValue(this.settings.uuid)
        this.f.id.setValue(this.settings.id)
        this.f.generalAccountLength.setValue(this.settings.generalAccountLength)
        this.f.thirdPartyAccountLength.setValue(this.settings.thirdPartyAccountLength)
      }else{
        this.f.generalAccountLength.setValue(6)
        this.f.thirdPartyAccountLength.setValue(6)
      }
    })
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm(){
    this.form = this.formBuild.group({
      uuid: [this.settings ? this.settings.uuid : null],
      id: [this.settings ? this.settings.uuid : null],
      generalAccountLength: [this.settings ? this.settings.generalAccountLength : 6],
      thirdPartyAccountLength: [this.settings ? this.settings.thirdPartyAccountLength : 6],
      syndic: [null],
      agency: [this.agency]
    })
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.generalService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'LENGTH_CODE_COMPTABLE_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'LENGTH_CODE_COMPTABLE_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })
    }
  }

  get f(): any { return this.form.controls; }


}
