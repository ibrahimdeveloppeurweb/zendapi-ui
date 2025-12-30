import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { ResponseService } from '@service/response/response.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.scss']
})
export class ResponseListComponent implements OnInit {

  @Input() responses: any[] = [];
  @Input() etat: boolean = true;
  @Input() action: boolean = true;
  @Input() typeList: string = 'liste';
  publicUrl = environment.publicUrl;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  total = 0;
  selectedData: any[] = [];

  form: FormGroup;

  constructor(
    private responseService: ResponseService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.etat = this.responses ? true : false;
    if (this.etat) {
      this.responses.forEach(item => {
        this.total += item.evaluation; 
      });
    }
    this.fetchAllResponses();
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      checkedAll: this.formBuilder.array([]),
    });
  }

  fetchAllResponses(): void {
    this.responseService.getList().subscribe((res: any) => {
      this.responses = res;
      console.log('Toutes les réponses:', this.responses);
    });
  }

  onSelectList(list: boolean): void {
    if (list) {
      this.responseService.getList().subscribe((res: any) => {
        this.responses = res.filter(item => item.list?.vedette === true);
      });
    } else {
      this.fetchAllResponses();
    }
  }

  onCheckAll(event: any): void {
    const isChecked = event.target.checked;
    this.selectedData = isChecked ? this.responses.slice() : [];
    this.updateAllCheckboxes(isChecked);
  }

  onCheckItem(item: any): void {
    const index = this.selectedData.indexOf(item);
    if (index === -1) {
      this.selectedData.push(item);
    } else {
      this.selectedData.splice(index, 1);
    }
    this.checkIfAllChecked();
  }

  updateAllCheckboxes(isChecked: boolean): void {
    const checkboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = isChecked;
    });
  }

  checkIfAllChecked(): void {
    const allCheckboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    const allChecked = Array.from(allCheckboxes).every((checkbox: HTMLElement) => (checkbox as HTMLInputElement).checked);
    const checkAllCheckbox = document.getElementById('checkAll') as HTMLInputElement;
    if (checkAllCheckbox) {
      checkAllCheckbox.checked = allChecked;
    }
  }

  deleteResponse(item: any): void {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cette réponse ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        return;
      } else {
        this.responseService.getDelete(item.id).subscribe(() => {
          const index = this.responses.findIndex(x => x.id === item.id);
          if (index !== -1) {
            this.responses.splice(index, 1);
          }
          Swal.fire('Réponse supprimée', '', 'success');
        });
      }
    });
  }

  viewResponse(item: any): void {
    console.log('Voir la réponse sélectionnée :', item);
  }

  get checkedAll(): FormArray {
    return this.form.get('checkedAll') as FormArray;
  }

}
