import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@service/user/user.service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '@model/user';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  form: FormGroup
  advance: boolean = true
  cookie: string = ''
  users: User[] = []

  @Input() type: boolean = false
  @Input() user: boolean = false
  @Input() name: boolean = false
  @Input() bien: boolean = false
  @Input() libelle: boolean = false
  @Input() autre: boolean = false
  @Input() etat: boolean = false
  @Input() dateD: boolean = false
  @Input() dateF: boolean = false
  @Input() create: boolean = false
  @Input() min: boolean = false
  @Input() max: boolean = false
  @Input() ordre: boolean = false
  @Input() code: boolean = false
  @Input() count: boolean = false
  @Input() categorie: boolean = false
  @Input() uuid: string = ""
  // @Input() exercice: boolean = false

  @Input() etatRow
  // @Input() exerciceRow
  @Input() currentYear
  @Input() typeRow
  @Input() categorieRow
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
  @Input() libelleTitle: string = "Libelle"
  @Input() userTitle: string = "Crée par"
  @Input() refTitle: string = "N° Référence"
  @Input() minTitle: string = "Montant MIN"
  @Input() maxTitle: string = "Montant MAX"
  @Input() categorieTitle: string = "Catégorie"
  @Input() etatTitle: string = "Etat"
  // @Input() exerciceTitle: string = "Année"

  @Input() nameType: string = 'TEXT';
  @Input() bienType: string = 'TEXT';
  @Input() autreType: string = 'TEXT';
  @Input() libelleType: string = 'TEXT';
  @Input() designationType: string = 'TEXT';
  @Input() categorieType: string = 'TEXT';
  @Input() etatType: string = 'TEXT';
  @Input() userType: string = 'TEXT';

  @Input() entitySelected: any;
  @Input() nameSelected: any;
  @Input() bienSelected: any;
  @Input() autreSelected: any;
  @Input() libelleSelected: any;

  @Input() nameClass: string = '';
  @Input() bienClass: string = '';
  @Input() autreClass: string = '';
  @Input() libelleClass: string = '';
  @Input() designationClass: string = '';
  @Input() categorieClass: string = '';
  @Input() etatClass: string = '';
  @Input() userClass: string = '';

  @Input() nameNamespace: string = '';
  @Input() bienNamespace: string = '';
  @Input() autreNamespace: string = '';
  @Input() libelleNamespace: string = '';
  @Input() designationNamespace: string = '';
  @Input() categorieNamespace: string = '';
  @Input() etatNamespace: string = '';
  @Input() userNamespace: string = '';

  @Input() nameGroups: string = '';
  @Input() bienGroups: string = '';
  @Input() autreGroups: string = '';
  @Input() libelleGroups: string = '';
  @Input() designationGroups: string = '';
  @Input() categorieGroups: string = '';
  @Input() etatGroups: string = '';
  @Input() userGroups: string = '';

  @Output() filterEvent = new EventEmitter<any>()
  @Output() typeEvent = new EventEmitter<any>()

  constructor(
    private formBuild: FormBuilder,
    public userService: UserService,
    public boarding: OnBoardingService,
  ) {
    this.userService.getList(null, null).subscribe(res => {
      this.users = res;
    }, error => {});
  }

  ngOnInit(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      type: [this.typeRow[0].value],
      categorie: [null],
      name: [null],
      autre: [null],
      libelle: [null],
      designation: [null],
      bien: [null],
      etat: [null],
      dateD: [null],
      dateF: [null],
      ordre: ['DESC'],
      min: [null],
      max: [null],
      create: [null],
      code: [null],
      count: [10],
      user: [null],
      // exercice:[this.currentYear]
    })
  }

  setValue(uuid, type){
    if(type === 'name'){
      this.f.name.setValue(uuid ? uuid : null);
    } else if(type === 'bien'){
      this.f.bien.setValue(uuid ? uuid : null);
    } else if(type === 'autre'){
      this.f.autre.setValue(uuid ? uuid : null);
    } else if(type === 'libelle'){
      this.f.libelle.setValue(uuid ? uuid : null);
    } else if(type === 'designation'){
      this.f.designation.setValue(uuid ? uuid : null);
    } else if(type === 'categorie'){
      this.f.categorie.setValue(uuid ? uuid : null);
    } else if(type === 'etat'){
      this.f.etat.setValue(uuid ? uuid : null);
    } else if(type === 'user'){
      this.f.user.setValue(uuid ? uuid : null);
    }
  }


  public types() {
    this.f.categorie.setValue(null);
    this.f.name.setValue(null);
    this.f.autre.setValue(null);
    this.f.libelle.setValue(null);
    this.f.bien.setValue(null);
    this.f.etat.setValue(null);
    this.f.dateD.setValue(null);
    this.f.dateF.setValue(null);
    this.f.ordre.setValue('DESC');
    this.f.min.setValue(null);
    this.f.max.setValue(null);
    this.f.create.setValue(null);
    this.f.code.setValue(null);
    this.f.count.setValue(10);
    this.f.user.setValue(null);
    this.entitySelected = null;
    this.nameSelected = null;
    this.autreSelected = null;
    this.bienSelected = null;
    this.libelleSelected = null;
    this.typeEvent.emit(this.form.value.type)
  }

  public filters() {
    this.filterEvent.emit(this.form.value)
  }

  get f() { return this.form.controls }

}
