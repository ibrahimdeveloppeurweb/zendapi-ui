import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  form: FormGroup

  @Input() type: boolean = false
  @Input() name: boolean = false
  @Input() bien: boolean = false
  @Input() autre: boolean = false
  @Input() etat: boolean = false
  @Input() dateD: boolean = false
  @Input() dateF: boolean = false
  @Input() create: boolean = false
  @Input() min: boolean = false
  @Input() max: boolean = false
  @Input() ordre: boolean = false
  @Input() count: boolean = false
  @Input() categorie: boolean = false
  @Input() uuid: string = ""

  @Input() etatRow = []
  @Input() typeRow = []
  @Input() categorieRow = []
  @Input() countRow = [
    { label: "Tout", value: 0 },
    { label: "1", value: 1 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "500", value: 500 }
  ]

  @Input() bienTitle: string = "Nom du bien"
  @Input() autreTitle: string = "Autre"
  @Input() nameTitle: string = "Nom et prénoms"
  @Input() refTitle: string = "N° Référence"
  @Input() minTitle: string = "Montant MIN"
  @Input() maxTitle: string = "Montant MAX"
  @Input() categorieTitle: string = "Catégorie"
  @Input() etatTitle: string = "Etat"

  @Output() filterEvent = new EventEmitter<any>()
  @Output() typeEvent = new EventEmitter<any>()

  constructor(
    private formBuild: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      type: [this.typeRow[0].value],
      categorie: [null],
      name: [null],
      autre: [null],
      bien: [null],
      etat: [null],
      dateD: [null],
      dateF: [null],
      ordre: ['DESC'],
      min: [null],
      max: [null],
      create: [null],
      count: [10],
    })
  }

  public types() {
    this.typeEvent.emit(this.form.value.type)
  }

  public filters() {
    this.filterEvent.emit(this.form.value)
  }

  get f() { return this.form.controls }
}
