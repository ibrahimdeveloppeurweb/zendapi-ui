import { Component,Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploaderService } from '@service/uploader/uploader.service';
import { SettingService } from '@service/setting/setting.service';
import { CountryService } from '@service/country/country.service';
import { Country } from '@model/country';
import { Setting } from '@model/setting';
import { environment } from '@env/environment';

@Component({
  selector: 'app-general-add',
  templateUrl: './general-add.component.html',
  styleUrls: ['./general-add.component.scss']
})
export class GeneralAddComponent implements OnInit {
  @Input() general: Setting
  publicUrl = environment.publicUrl;
  title: string = ""
  form: FormGroup
  country: Country
  edit: boolean = false
  submit: boolean = false
  countrySelected: any
  dateGRow: any = [
    { label: "1 du mois", value: 1 },
    { label: "2 du mois", value: 2 },
    { label: "3 du mois", value: 3 },
    { label: "4 du mois", value: 4 },
    { label: "5 du mois", value: 5 },
    { label: "6 du mois", value: 6 },
    { label: "7 du mois", value: 7 },
    { label: "8 du mois", value: 8 },
    { label: "9 du mois", value: 9 },
    { label: "10 du mois", value: 10 },
    { label: "11 du mois", value: 11 },
    { label: "12 du mois", value: 12 },
    { label: "13 du mois", value: 13 },
    { label: "14 du mois", value: 14 },
    { label: "14 du mois", value: 14 },
    { label: "15 du mois", value: 15 },
    { label: "16 du mois", value: 16 },
    { label: "17 du mois", value: 17 },
    { label: "18 du mois", value: 18 },
    { label: "19 du mois", value: 19 },
    { label: "20 du mois", value: 20 },
    { label: "21 du mois", value: 21 },
    { label: "22 du mois", value: 22 },
    { label: "23 du mois", value: 23 },
    { label: "24 du mois", value: 24 },
    { label: "25 du mois", value: 25 },
    { label: "26 du mois", value: 26 },
    { label: "27 du mois", value: 27 },
    { label: "28 du mois", value: 28 },
    { label: "29 du mois", value: 29 },
    { label: "30 du mois", value: 30 },
    { label: "31 du mois", value: 31 },
  ];
  paiementRow: any = [
    { label: "OUI", value: "OUI"},
    { label: "NON", value: "NON"}
  ];

  constructor(
    private formBuild: FormBuilder,
    public uploadService: UploaderService,
    public countryService: CountryService,
    private settingService: SettingService
  ) {
    this.title = "PARAMETRE DE L'AGENCE"
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      agree: [false],
      photoUuid: [null],
      signatureUuid:[null],
      nom: [null],
      type: ['ENTREPRISE'],
      etat: ['DESACTIVE'],
      paiement: ['NON'],
      responsable: [null],
      contact: [null],
      adresse: [null],
      dateG: [null],
      domicile: [null],
      ville: [null],
      commune: [null],
      quartier: [null],
      capital: [null],
      faxe: [null],
      email: [null],
      nrc: [null],
      ncc: [null],
      sender: [null],
      country: [null],
      entete: [null],
      piedPage: [null],
      photoSrc: [null],
      signatureSrc:[null],
      signature: [null],
      impot: [0],
      tva: [0],
      editFile: [false],
      editFileS: [false],
      files: this.formBuild.array([]),
      filesSign: this.formBuild.array([]),
      secteur: [null]
    });
  }
  editForm() {
    const data = {...this.general};
    this.countrySelected = {
      photoSrc: data?.country?.photoSrc,
      signatureSrc: data?.country?.signatureSrc,
      title: data?.country?.searchableTitle,
      detail: data?.country?.searchableDetail
    };
    this.f.photoSrc.setValue(data?.photoSrc);
    this.f.signatureSrc.setValue(data?.signatureSrc);
    data.country = data?.country?.uuid;
    this.form.patchValue(data);
  }
  editGeneral(edit){
    this.edit = edit
    this.title = edit ? "MODIFICATION DES PARAMETRES" : "PARAMETRE DE L'AGENCE"
    if(!this.edit){
      this.editForm()
    }
  }
  setCountryUuid(uuid) {
    this.f.country.setValue(uuid);
    this.loadCountry(uuid)
  }
  loadCountry(uuid){
    if(uuid) {
      this.countryService.getSingle(uuid).subscribe(res => {
        this.country = res
        this.f.ville.setValue(res?.capital)
      }, error => {})
    }
  }
  onSubmit() {
    this.settingService.add(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.general = res?.data;
        this.title = ""
        this.edit = false
      }
    }, error => {});
  }
  editFile(bool) {
    this.f.editFile.setValue(bool);
  }
  editFileS(bool) {
    this.f.editFileS.setValue(bool);
  }
  loadfile(data) {
    if(data && data !== null){
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
  loadfileSignature(data){
    if(data && data !== null){
      const fileSignature = data.todo.file
      this.fileSignature.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [fileSignature.name, [Validators.required]],
          fileSize: [fileSignature.size, [Validators.required]],
          fileType: [fileSignature.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }

  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  uploadfileSignature(fileSignatures): void {
    for (const file of fileSignatures) {
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
  get f() { return this.form.controls }
  get file() { return this.form.get('files') as FormArray; }
  get fileSignature() { return this.form.get('filesSign') as FormArray; }
}
