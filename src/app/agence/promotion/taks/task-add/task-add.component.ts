import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Home } from '@model/home';
import { Tasks } from "@model/tasks";
import { Worksite } from '@model/worksite';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { HomeService } from '@service/home/home.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { TasksService } from '@service/tasks/tasks.service';
import { WorksiteService } from '@service/worksite/worksite.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent implements OnInit {

  worksites: Worksite[] = [];
  dtOptions: any = {};
  etat: boolean = false
  
  title: string = '';
  dateM = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false
  required = Globals.required;
  tasks: Array<Tasks> = [];
  homes: Array<Home> = [];  
  selectedHomes: string[] = [];

  constructor(
    public modal: NgbActiveModal,
    public router: Router,
    private route: ActivatedRoute,    
    public toastr: ToastrService,
    private worksiteService: WorksiteService,
    private promotionService: PromotionService,
    private homeService: HomeService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private tasksService: TasksService,
  ) {
    this.title = 'Ajouter le planing des tâches';
    this.newForm();
  }

  ngOnInit(): void {
    this.load()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      home: [null, [Validators.required]],
      worksite: [null, [Validators.required]],
    });
  }


  load() {        
    this.tasksService.edit = false;
    let promotion = this.promotionService.getPromotion()
    this.homeService.getList(promotion.uuid,null,'PLANNING').subscribe((res) => {        
        return this.homes = res;
      }, error => {}
    );
    this.worksiteService.getList().subscribe((res) => {
      return this.worksites = res;
      }, error => {}
    );
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      var data = this.form.getRawValue();
      this.tasksService.add(data).subscribe(
        (res) => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({
              action: 'TASKS_ADD',
              payload: res?.data,
            });
          }
          this.emitter.stopLoading();
        },
        (error) => {}
      );
    } else {
      this.toast(
        "Votre formualire n'est pas valide.",
        'Attention !',
        'warning'
      );
      return;
    }
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: "Confirmez-vous l'enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true,
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  onPlaning() {
    if(this.f.worksite.value) {
      let info:any =[]
      this.selectedHomes.forEach(element => {
        const data = this.homes.find(item => item.uuid === element);        
        info.push(data)
      });
      this.homeService.setHome(info)
      this.router.navigate(['/outils/gantt/' + this.f.worksite.value + '/PLANNING'], { state: { data: this.f.home.value }});
    }
  }

  onClose() {
    this.form.reset();
    this.modal.close('ferme');
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f() {
    return this.form.controls;
  }

}
