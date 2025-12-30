import { Home } from '@model/home';
import { Report } from '@model/report';
import { ToastrService } from 'ngx-toastr';
import { Promotion } from '@model/promotion';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HomeService } from '@service/home/home.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '@service/report/report.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-add',
  templateUrl: './report-add.component.html',
  styleUrls: ['./report-add.component.scss']
})
export class ReportAddComponent implements OnInit {
  imageName: any;
  filesList = [];
  formJusti: FormGroup;
  selectedFiles: File[];
  images: string[] = [];


  home: Home;
  report: Report;
  form: FormGroup;
  title: string = "";
  tasks: any[] = [];
  homes: Home[] = [];
  taskParent: any[] = [];
  taskChildren: any[] = [];
  promotion: Promotion;
  edit: boolean = false;
  showTask: boolean = false;
  showField: boolean = false;
  submit: boolean = false;
  required = Globals.required;
  typeRow = [
    { value: "QUOTIDIEN", label: "QUOTIDIEN" },
    { value: "PERIODIQUE", label: "PÉRIODIQUE" }
  ]

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private homeService: HomeService,
    private reportService: ReportService,
    private promotionService: PromotionService,
    public uploadService: UploaderService,
  ) {
    this.edit = this.reportService.edit
    this.report = this.reportService.getReport()
    this.title = (!this.edit) ? "Ajouter un rapport" : "Modifier le rapport "+this.report.libelle;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ["QUOTIDIEN", [Validators.required]],
      date: [null],
      dateD: [null],
      dateF: [null],
      libelle: [null, [Validators.required]],
      promotion: [null],
      home: [null],
      realisations: this.formBuild.array([]),

      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.reportService.getReport() }
      console.log('data',data)
      this.form.get('uuid').setValue(this.report.uuid);
      data.date = DateHelperService.fromJsonDate(data.dateD);
      data.dateD = DateHelperService.fromJsonDate(data.dateD);
      data.dateF = DateHelperService.fromJsonDate(data.dateF);
      this.form.patchValue(data)
      this.showTask = true
      this.form.get('uuid').setValue(this.report.uuid);      
      this.form.get('home').setValue(this.report.uuid);      
      data.options.forEach(element => {        
        this.realisations.push(
          this.formBuild.group({
            uuid: [element.uuid],
            numero: [element.task.code],
            libelle: [element.task.libelle],
            unite: [element.task.unite],
            qte: [element.task.qte ? element.task.qte : 0],           
            qteRealise: [element.task.qteEffectue ? element.task.qteEffectue  : 0],           
          })
        )
      });
      
    }
  }
  onSelectType($event) {
    let value = $event.target.value;
    if(value === 'QUOTIDIEN') {
      this.form.get('dateD').setValue(null);
      this.form.get('dateF').setValue(null);
      // this.form.get('date').setValidators(Validators.required);
    } else {
      this.form.get('date').setValue(null);
      // this.form.get('dateD').setValidators(Validators.required);
      // this.form.get('dateF').setValidators(Validators.required);
    }
  }

  setPromotionUuid(uuid){
    if(uuid){
      this.showField = true;
      this.promotionService.getSingle(uuid).subscribe(res => {
        this.promotion = res;
        let data = []
        res.homes.forEach(element => {
          if(element.tasks.length != 0) { 
            data.push(element)
          }
        });
        this.homes = data;
      })
    } else {
      this.realisations.clear();
      this.showTask = false;
      this.homes = []
    }
  }
  setHomeUuid(uuid){
    this.realisations.clear();
    if(uuid){
      this.homeService.getSingle(uuid).subscribe(res => {
        this.home = res;
        this.showTask = true;
        this.tasks = this.home.tasks;
        this.taskParent = this.tasks.filter(item => item.parent === null);
        this.taskChildren = this.tasks.filter(item => item.parent !== null && item.parent);
      })
    } else {
      this.realisations.clear();
      this.showTask = false;
      this.taskChildren = []
    }
  }
  onSelectTask(value){
    const verif = this.realisations.controls.filter(item => item.get('task').value === value.uuid)
    if (verif.length == 0) {
      this.realisations.controls.push(
        this.formBuild.group({
          id: [null],
          uuid: [null],
          numero: [value.numero],
          libelle: [value.libelle],
          qte: [value.qte],
          unite: [value.unite],
          qteRealise: [null],
          imageName: [null],
          images: [null],
          task: [value.uuid],
        })
      )
    } else {
      Swal.fire( 'Attention !', 'Cette tâche a été déjà ajouter à la liste!', 'warning' );
    }





    // this.realisations.controls.push(
    //   this.formBuild.group({
    //     id: [null],
    //     uuid: [null],
    //     numero: [value.numero],
    //     libelle: [value.libelle],
    //     qte: [value.qte],
    //     qteRealise: [null],
    //     imageName: [null],
    //     images: [null],
    //     task: [value.uuid],
    //   })
    // )



    // if(uuid){
    //   this.homeService.getSingle(uuid).subscribe(res => {
    //     this.home = res;
    //     if(this.home.tasks) {
    //       this.showTask = true;
    //       this.tasks = this.home.tasks;
    //       this.taskParent = this.tasks.filter(item => item.parent === null);
    //       this.taskChildren = this.tasks.filter(item => item.parent !== null);
    //       this.taskChildren.forEach(item => {
    //         this.realisations.controls.push(
    //           this.formBuild.group({
    //             id: [null],
    //             uuid: [null],
    //             numero: [item.numero],
    //             libelle: [item.libelle],
    //             qte: [item.qte],
    //             qteRealise: [null],
    //             imageName: [null],
    //             images: [null],
    //             task: [item.uuid],
    //           })
    //         )
    //       })
    //     }
    //     // this.realisations.controls = null;
    //   })
    // } else {
    // }
  }
  onFileChange(event, item) {
    // this.images = [];
    let fileName: any;
    if(event.target.files.length > 0) {
      fileName = event.target.files[0].name
      item.get('imageName').value = fileName
    }

    this.selectedFiles = event.target.files;
    if(this.selectedFiles) {
      if (this.filesList.length != 0) {
        this.filesList = this.filesList.filter((file) => file.name !== "Image")
      }
      this.imageName = this.selectedFiles[0];
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
          // console.log(this.images)
          item.get('images').setValue(this.images)
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  // onUpload(item) {
  //   this.images = [];
  //   item.get('images').setValue(this.images)
  // }

  onCalcul(value, item) {
    if(value > item.get('qte').value) {
      Swal.fire(
        'Attention !',
        'La quantité réalisée ne peut être supperieur a la quantite',
        'warning'
      );
      item.get('qteRealise').setValue(null)
    }
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
    if (this.form.valid) {      
      const form = { ...this.form.getRawValue() };
      var formData = new FormData()
      formData.append("data", JSON.stringify(form))
      this.reportService.add(formData).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'REPORT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'REPORT_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
    }
  }
  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'report'}
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
      this.toastr.info(msg, title)
    } else if (type == 'success') {
      this.toastr.success(msg, title)
    } else if (type == 'warning') {
      this.toastr.warning(msg, title)
    } else if (type == 'error') {
      this.toastr.error(msg, title)
    }
  }

  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get realisations() { return this.form.get('realisations') as FormArray; }
}
