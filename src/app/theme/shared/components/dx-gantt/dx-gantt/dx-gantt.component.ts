import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { DxGanttComponent as DxGantt } from 'devextreme-angular';
//@ts-ignore
import fr from 'devextreme/localization/messages/fr.json';
import { locale, loadMessages } from 'devextreme/localization';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { exportGantt as exportGanttToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { Globals } from '@theme/utils/globals';
import { WorksiteService } from '@service/worksite/worksite.service';
import { OptionDqService } from '@service/option-dq/option-dq.service';
import { TasksService } from '@service/tasks/tasks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '@service/home/home.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dx-gantt',
  templateUrl: './dx-gantt.component.html',
  styleUrls: ['./dx-gantt.component.scss'],
})
export class DxGanttComponent implements OnInit {
 
  // Configs & variables about the GANTT
  @ViewChild(DxGantt, { static: false }) gantt: DxGantt;
  ganttInstance: any
  isPopupVisible: boolean = false;
  isLoadingVisible: boolean = false;
  @Input() dqUuid: any
  @Input() planningUuid: any
  workSiteUuid: string = ''
  homeUuid: string = ''
  promotion: any
  home: any
  dq: any
  planning: any
  title: string = "";
  tasks = []
  dependencies = []
  task: any
  typesList = [
    { label: 'DQ', value: 'DQ' },
    { label: 'PLANNING', value: 'PLANNING' },
  ]
  @Input() hasToBeTrue
  @Input() type

  saveButtonOptions = {
    text: "Enregistrer",
    stylingMode: "contained",
    type: "normal",
    width: 300,
    useSubmitBehavior: true
  }

  cancelButtonOptions = {
    text: "Annuler",
    stylingMode: "contained",
    type: "normal",
    width: 300,
    onClick: () => {
      this.isPopupVisible = false;
    }
  }

  prioritiesSelectBoxOptions = {
    items: [
      'NORMALE',
      'INTERMEDIAIRE',
      'ELEVEE'
    ],
    searchEnabled: true,
    value: 'NORMALE'
  }
  parentsArray: any[] = []
  printButtonOptions: any
  userSession = Globals.user;
  formatedPrice: any = 0;
  formatedQuantity: any = 0;
  dtOptions: any = {};
  selectedTaskId: any
  isInserted: boolean = false

   
  constructor(
    public _location: Location,
    private route: ActivatedRoute,
    private taskService: TasksService,
    private homeService: HomeService,
    private modalService: NgbModal,
    private tasksService: TasksService,
    private promotionService: PromotionService,
    private worksiteService: WorksiteService,
    private optionDqService: OptionDqService
  ) {
    loadMessages(fr);
    locale(navigator.language);
    this.type = this.type ? this.type : this.route.snapshot.params.type;
    switch (this.type) {
      case 'DQ':
        this.title = 'Dévis quantitatif du lot';
        break;
      case 'PLANNING':
        this.title ='Planning des travaux'
        break;

      case 'EDIT':
        this.title = 'Modifier le planning'
        break;

      case 'SHOW':
        this.title = 'Détails des travaux'
      break;
      
      default:
        this.title = ''
        break;
    }   
  }



  ngOnInit(): void {
    this.onLoad();
    this.dtOptions = Globals.dataTable;
  }

  onLoad() {    
    if (this.type === 'DQ') { 
      this.workSiteUuid = this.route.snapshot.params ? this.route.snapshot.params.id : null;
      this.worksiteService.getSingle(this.workSiteUuid).subscribe((res) => {
        if (res) {
          this.dq = res;
        }
      });
      this.getOptionDQ(this.workSiteUuid);
    }

    if (this.type === 'PLANNING') {
      this.workSiteUuid = this.route.snapshot.params ? this.route.snapshot.params.id : null;
      let data = history.state.data;
      this.modalService.dismissAll();
      this.promotion = this.promotionService.getPromotion();
      this.home = this.homeService.getHome();
      // this.dq = true
      if (data == undefined || this.home == 'undefined') {
        this._location.back();
      }     
     this.getOptionDQ(this.workSiteUuid);
    }

    if (this.type === 'EDIT') {
      this.homeUuid = this.route.snapshot.params ? this.route.snapshot.params.id : null           
      this.homeService.getSingle(this.homeUuid).subscribe((res: any) => {
        if (res) {
          this.home = res
          this.dq = true
          this.promotion = res.promotion
        }
      })            
      this.homeService.getTravaux(this.homeUuid).subscribe((res: any) => {
        if (res) {          
          this.parseTaskData(res)
        }
      })
      this.homeService.getLiaison(this.homeUuid).subscribe((res: any) => {
        if (res) {                   
          this.parseDependencyData(res)
        }
      })
    }

    if (this.type === 'SHOW') {
      this.homeUuid = this.route.snapshot.params ? this.route.snapshot.params.id : null           
      this.homeService.getSingle(this.homeUuid).subscribe((res: any) => {
        if (res) {
          this.home = res
          this.dq = true
          this.promotion = res.promotion
        }
      })            
      this.homeService.getTravaux(this.homeUuid).subscribe((res: any) => {
        if (res) {          
          this.parseTaskData(res)
        }
      })
    }

    // this.exportButtonOptions = {
    //   hint: 'Exporter en PDF',
    //   icon: 'exportpdf',
    //   stylingMode: 'text',
    //   onClick: () => this.exportButtonClick(),
    // };

    this.printButtonOptions = {
      hint: 'Imprimer',
      icon: 'print',
      stylingMode: 'text',
      onClick: () => this.print(),
    };
  }

  getOptionDQ(uuid) {
    this.optionDqService.getList(uuid).subscribe((res) => {
      if (res) {
        this.parseTaskData(res);
      }
    });
  }
  onGanttInitialized(e) {
    this.ganttInstance = this.gantt.instance
    if (this.type === "DQ" || this.type === "SHOW") {
      this.hideGanttChart()
    }
  }

  // Get all tasks from GANTT
  getElements() {
    this.isLoadingVisible = true
    const form = {
      worksite: this.workSiteUuid,
      home: this.homeUuid,
      options: this.tasks,
      liaisons: this.dependencies
    }
    this.sendformData(form)
    setTimeout(() => {
      this.isLoadingVisible = false
    }, 3000)
  }

  sendformData(form) {
    const formdata: FormData = new FormData()
    formdata.append('data', JSON.stringify(form));

    if (this.type === 'DQ') {
      this.optionDqService.add(formdata).subscribe((res: any) => {
        if (res.status === 'success') {
          this._location.back();
          let data = res.data.options;
          this.parseTaskData(data);
        }
      });
    }
    if (this.type === 'PLANNING') {
      formdata.append('homes', JSON.stringify(history.state.data));
      this.tasksService.add(formdata).subscribe((res: any) => {
        if (res.status === 'success') {
          let data = res.data;
          this._location.back();
          this.parseTaskData(data.options);
          this.parseDependencyData(data.liaisons);
        }
      });
    }
    if (this.type === 'EDIT') {
      this.tasksService.update(formdata).subscribe((res: any) => {
        if (res.status === 'success') {
          let data = res.data;
          this._location.back();
          this.parseTaskData(data.options);
          this.parseDependencyData(data.liaisons);
        }
      });
    }
  }

  // Show task form
  showTaskPopup(e) {
    let data = e.data
    e.cancel = true
    this.task = data    
    this.formatedQuantity = data.quantity ? this.formatter(data.quantity) : this.formatter(0)
    if (this.type === "DQ" || this.type === "PLANNING" || this.type === "EDIT") {
      this.isPopupVisible = true
    }
  }

  // Called when closing task form
  onHidingPopup(e) {
    this.isPopupVisible = false
  }

  // Save task changes from task form & repaint GANTT UI
  onSubmitForm(e) {
    this.updateTaskDetails(this.task.id, this.task)
    if (this.type ==="DQ") {
      this.hideGanttChart()
    }
    
    if (this.type === "EDIT" || this.type === "PLANNING") {
        this.isInserted = true      
    }
    this.isPopupVisible = false
    this.ganttInstance.refresh()
  }

  // Called to updated the selected task data
  updateTaskDetails(taskId, data) {
    try {
      if (this.isInserted) {
        let taskIndex = this.tasks.findIndex(task => task.id === taskId);
        this.tasks[taskIndex].code = data.code
        this.tasks[taskIndex].priority = data.priority
        this.tasks[taskIndex].title = data.title
        this.tasks[taskIndex].parentId = data.parentId
        this.tasks[taskIndex].price = data.price
        this.tasks[taskIndex].quantity = data.quantity
        this.tasks[taskIndex].unite = data.unite
        this.tasks[taskIndex].start = data.start
        this.tasks[taskIndex].end = data.end
        this.tasks[taskIndex].progress = data.progress
        this.tasks[taskIndex].color = this.onChangeColor(data.priority)
      } else {
        let taskData = {
          id: taskId,
          code: data.code,
          priority: data.priority,
          title: data.title,
          parentId: data.parentId,
          qteEffectue: data.qteEffectue,
          evolution: data.evolution,
          price: data.price,
          quantity: data.quantity,
          unite: data.unite,
          start: data.start,
          end: data.end,
          progress: data.progress,
          color: this.onChangeColor(data.priority)
        }
        this.gantt.instance.updateTask(taskId, taskData)
      }
    } catch (error) {
    }
    this.updateTotal();
    if (this.type === "PLANNING") {
      this.gantt.instance.repaint()
    }
  }

  // Called to update task color according to the choosen priority
  onChangeColor(priority) {
    let color = ""
    if (priority === "INTERMEDIAIRE") {
      color =  "orange"
    }
    if (priority === "ELEVEE") {
      color = "red"
    }
    return color
  }

  // Get all task's children
  getTaskChildren(taskId) {
    return this.tasks.filter(child => child.parentId === taskId)
  }

  hideGanttChart() {
    this.hasToBeTrue = false
    $('document').ready(() => {
      let splitter = document.querySelector(".dx-splitter-wrapper") as HTMLElement | null
      let taskListWrapper = document.querySelector(".dx-gantt-treelist-wrapper") as HTMLElement | null
      let taskList = document.querySelector(".dx-treelist") as HTMLElement | null
      let chart = document.querySelector(".dx-gantt-view") as HTMLElement | null
      splitter.style.display = "none"
      taskListWrapper.style.width = "auto"
      taskList.style.width = "auto"
      chart.style.display = "none"
    })
  }

  parseTaskData(data) {
    this.tasks = []
    console.log("idid",data)
    data.forEach((task) => {
    console.log("task",task)

      this.tasks.push({
        id: task.uuid,
        code: task.numero,
        priority: task.priorite ? task.priorite : null,
        title: task.libelle,
        parentId: task.parent ? task.parent.uuid : null,
        price: task.prix ? task.prix : null,
        quantity: task.qte ? task.qte : null,
        qteEffectue: task.qteEffectue,
        evolution: task.evolution,
        unite: task.unite ? task.unite : null,
        total: task.total ? task.total : null,
        start: task.dateD ? task.dateD : null,
        end: task.dateF ? task.dateF : null,
        progress: task.progress ? task.progress : null,
        color: this.onChangeColor(task.priorite ? task.priorite : null)
      })
    })

    console.log("task",this.tasks)

    this.getResume()
    this.gantt.instance.repaint()
    if (this.type !== "PLANNING" || this.type !== 'EDIT'  || this.type !== "SHOW") {
      this.hideGanttChart()
    }
  }

  parseDependencyData(data) {
    this.dependencies = []
    data.forEach((dependency) => {
      this.dependencies.push({
        id: dependency.uuid,
        predecessorId: dependency.taskFrom.uuid,
        successorId: dependency.taskTo.uuid,
        type: dependency.type
      })
    })
    this.gantt.instance.repaint()
  }

  onTaskDeleted(e) {
    this.isLoadingVisible = true
    setTimeout(() => {
      this.isLoadingVisible = false
    }, 3000)

    if (this.type === 'DQ') {
      this.optionDqService.delete(e.key).subscribe((res: any) => {});
    }

    if (this.type === 'EDIT') {
       this.taskService.delete(e.key).subscribe((res: any) => {
         console.log(res)
         console.log('ici')
       })
    }

  }

  onDependencyDeleted(e) {
    this.isLoadingVisible = true
    setTimeout(() => {
      this.isLoadingVisible = false
    }, 3000)
  }

  getResume() {
    let onlyParentsArray = this.tasks.filter(task => task.parentId === null)
    let totalQteEff = 0    
    onlyParentsArray.forEach(parent => {
      let object = {
        code: parent.code,
        designation: parent.title,
        total: 0,
        qteEffectue: 0,
        percent: 0
      }
      this.tasks.forEach(task => {      
        if (task.parentId && task.parentId === parent.id) {
          object.percent = 0
          object.total += (task.quantity ? task.quantity : 0)
          object.qteEffectue += (task.qteEffectue ? task.qteEffectue : 0)          
        }
      })      
      this.parentsArray.push(object)
    })
    this.parentsArray.forEach(parent => {
    
      totalQteEff += (parent.qteEffectue ?  parent.qteEffectue : 0)
    })
    
    this.parentsArray.forEach(parent => {
      parent.percent = (parent.qteEffectue * 100) / parent.total    
    })

    return this.parentsArray;
  }

  sumWithChildren(task) {
    let currentElement = task;
    let price = currentElement.price ? currentElement.price : 0;
    let quantity = currentElement.quantity ? currentElement.quantity : 0;
    let sum = price * quantity;

    let children = this.getTaskChildren(currentElement.id)

    if (children) {
      for (let child of children) {
        sum += this.sumWithChildren(child);
      }
    }

    return sum;
  }

  updateTotal() {
    this.tasks.forEach(task => {
      let total = this.sumWithChildren(task)
      if (this.isInserted) {
        let taskIndex = this.tasks.findIndex(t => t.id === task.id);
        this.tasks[taskIndex].total = total
      } else {
        this.gantt.instance.updateTask(task.id, {total: total})
      }
    })
    this.isInserted = false
  }

  calculDuration(task) {
    let start = moment(task.start)
    let end = moment(task.end)
    let diff = end.diff(start)
    let days = moment.duration(diff).asDays()
    return Math.round(days)
  }


  print() {
    console.log('this.type ', this.type, this.dq)
    if (this.type === "PLANNING" || this.type === "DQ" || this.type === "EDIT") {
      // this.taskService.getPrinter('EDIT', this.userSession.uuid, this.dq.uuid);
      this.taskService.getPrinter('EDIT', this.userSession?.agencyKey, this.userSession?.uuid, this.homeUuid);
    }

    if (this.type === "PLANNING") {

    }
    console.log('his.userSession?.uuid',this.homeUuid)
    if (this.type === 'SHOW') {       
      this.taskService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, this.homeUuid);
    }
  }

  onSubStringLongName(str: string): any {
    if (str !== null) {
      if (str.length > 28) {
        return str.substring(0, 28) + ' ...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  }

  formatNumber (task) {
    let field =  task.dataField
    let value =  task.value
    if (field === "quantity") {
      this.formatedQuantity = value ? this.formatter(value) : this.formatter(0);
    }
  }

  formatter(value) {
    return value.toLocaleString('fr-FR');
  }

  onCustomCommand(e) {
    let selectedTaskIndex = this.tasks.findIndex(task => task.id === this.selectedTaskId)
    let selectedTaskData = this.ganttInstance.getTaskData(this.selectedTaskId)

    if (e.name === "addTaskUp") {
      let index = selectedTaskIndex
      const uuid = uuidv4();
      let newTask = {
        id: uuid,
        title: "New task",
        parentId: (selectedTaskData.parentId) ? selectedTaskData.parentId : null,
        start: new Date(),
        end: new Date()
      }
      this.tasks.splice(index, 0, newTask)
      selectedTaskIndex = index
    }
    if (e.name === "addTaskDown") {
      let index = selectedTaskIndex + 1
      const uuid = uuidv4();
      let newTask = {
        id: uuid,
        title: "New task",
        parentId: (selectedTaskData.parentId) ? selectedTaskData.parentId : null,
        start: new Date(),
        end: new Date()
      }
      this.tasks.splice(index, 0, newTask)
      selectedTaskIndex = index
    }
    if (e.name === "addSubTaskDown") {
      let index = selectedTaskIndex + 1
      const uuid = uuidv4();
      let newTask = {
        id: uuid,
        title: "New task",
        parentId: this.selectedTaskId,
        start: new Date(),
        end: new Date()
      }
      this.tasks.splice(index, 0, newTask)
      selectedTaskIndex = index
    }

    this.ganttInstance.refresh()
    if (this.type !== "PLANNING") {
      this.hideGanttChart()
    }
    this.isInserted = true
  }

  onSelectionChanged(e) {
    this.selectedTaskId = e.selectedRowKey
  }

}
