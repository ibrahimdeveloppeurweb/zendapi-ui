import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { IsletService } from '@service/islet/islet.service';
import { LocalisationService } from '@service/localisation/localisation.service';
import { LotService } from '@service/lot/lot.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AfterViewInit {

  type = null;
  entity: any;
  load: any;
  title = null;
  label = null;
  submit = false;
  form: FormGroup;
  edit: boolean = false;
  selectFile: File = null
  required = Globals.required;
  publicUrl = environment.publicUrl;

  arrays = [];

  constructor(
    public router: Router,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private lotService: LotService,
    private emitter: EmitterService,
    private isletService: IsletService,
    public uploadService: UploaderService,
    private subdivisionService: SubdivisionService,
    public localisationService: LocalisationService
  ) {
    this.edit = this.localisationService.edit;
    this.type = this.localisationService.type;
    this.entity = this.localisationService.getLocalisation();
    this.load = this.entity
    this.title = (!this.edit) ? 'Ajout des coordonnées géotechniques' : 'Modification des coordonnées géotechniques';

    if (this.type === "ILOT") {
      this.label = "Ilots";
      this.isletService.getList(this.entity.uuid).subscribe(res => { return this.arrays = res; }, error => {} );
    }
    if (this.type === "LOT") {
      this.label = "Lots";
      this.lotService.getList(null, this.entity.uuid).subscribe(res => { return this.arrays = res; }, error => {} );
    }
    this.newForm()
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      nb: [null],
      type: [null, [Validators.required]],
      entity: [this.entity.uuid, [Validators.required]],
      coordonnees: this.formBuild.array([])
    })
  }
  onLoadData(event){
    if (this.type === "ILOT") {
      this.label = "Ilots";
      this.isletService.getSingle(event).subscribe(res => { 
        this.loadEdit(res)
        return this.load = res; 
      }, error => {} );
    }
    if (this.type === "LOT") {
      this.lotService.getSingle(event).subscribe(res => { 
        this.loadEdit(res)
        return this.load = res; 
      }, error => {} );
    }

  }
  loadEdit(data){
    this.coordonnees.clear()
    this.coordonnees.controls = []
    const array = data.coordonnees
    const nb = array.length
    this.f.nb.setValue(nb)
    array.forEach((item, i) => {
      this.coordonnees.push(this.formBuild.group({
        id: [null],
        uuid: [null],
        point: [{value: i + 1, disabled: true}, [Validators.required]],
        lat: [item[1], [Validators.required]],
        lng: [item[0], [Validators.required]]
      }));
    });

  }
  onChangeType(){
    if(this.f.type.value === 'DESSINER'){
      this.router.navigate(['/outils/geo-localisation/'+ this.entity.uuid+'/'+this.type+'/'+'ADD'])
      this.modal.dismiss();
      this.modal.close('ferme');
    }
  }
  onChangeNumber(){
    this.onLoadCoordonnees()
  }
  // onLoadCoordonnees() {
  //   if (this.f.type.value === 'MANUEL') {
  //     let nb  = this.f.nb.value;
  //     if (0 < nb) {
  //       for (let i = 0; i < nb; i++) {
  //         var num = i + 1;
  //         this.coordonnees.push(
  //           this.formBuild.group({
  //             id: [null],
  //             uuid: [null],
  //             point: [{value: num, disabled: true}, [Validators.required]],
  //             lat: [{value: null, disabled: false}, [Validators.required]],
  //             lng: [{value: null, disabled: false}, [Validators.required]]
  //           })
  //         );
  //       }
  //     }

  //   }
  // }
  onLoadCoordonnees() {
    const nb = parseInt(this.f.nb.value, 10); // Assurez-vous que nb est un nombre
    if (this.f.type.value === 'MANUEL' && !isNaN(nb) && nb > 0) {
      this.coordonnees.clear(); // Nettoyez le FormArray avant de le remplir
      for (let i = 0; i < nb; i++) {
        this.coordonnees.push(this.formBuild.group({
          id: [null],
          uuid: [null],
          point: [{value: i + 1, disabled: true}, [Validators.required]],
          lat: [null, [Validators.required]],
          lng: [null, [Validators.required]]
        }));
      }
    }
  }
  onModel(){
    this.localisationService.getGenerer('ONE');
  }
  onFileChangeOne(event) {
    let file = event.target.files;
    if (file && file[0]) {
      let filename = file[0].name;
      // if (filename.lastIndexOf(".xls") <= 0) {
      //   return this.Toast.fire({
      //         icon: 'info',
      //         title: 'Importation: ',
      //         text: 'Veuillez selectionner un fichier excel au format (.xls)'
      //       })
      // }
      // if (file[0].size > 1048576) {
      //   return this.Toast.fire({
      //         icon: 'info',
      //         title: 'Importation: ',
      //         text: 'Veuillez selectionner un fichier dont la taille est inférieure à 2 Mo'
      //       })
      // }
      this.selectFile =  <File>file[0]
    }
  }
  onExporter(){
    const formData = new FormData();
    formData.append('file', this.selectFile, this.selectFile.name);
    this.localisationService.import(formData).subscribe(res => {
      if (res?.status === 'success') {
        console.log(res.data)
      }
      this.emitter.stopLoading();
    },
    error => { });
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
      if (this.type === 'LOTISSEMENT') {
        this.subdivisionService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.modal.dismiss();
              this.modal.close('ferme');
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
          },
          error => { });
      }else if(this.type === 'ILOT'){
        this.isletService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.modal.dismiss();
              this.modal.close('ferme');
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
          },
          error => { });

      }else if(this.type === 'LOT'){
        this.lotService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.modal.dismiss();
              this.modal.close('ferme');
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
          },
          error => { });

      }
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
      return;
    }
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
  onReset() {
    this.form.reset()
  }

  get f(): any { return this.form.controls; }
  get options() { return this.form.get('options') as FormArray; }
  get coordonnees() { return this.form.get('coordonnees') as FormArray; }
}
