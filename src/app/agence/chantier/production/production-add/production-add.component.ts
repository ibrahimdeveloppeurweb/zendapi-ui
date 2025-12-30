
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl }from '@angular/forms';
import { Construction } from '@model/construction';
import { Production } from '@model/production';
import { Quote } from '@model/quote';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '@service/construction/construction.service';
import { ProductionService } from '@service/production/production.service';
import { QuoteService } from '@service/quote/quote.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-production-add',
  templateUrl: './production-add.component.html',
  styleUrls: ['./production-add.component.scss']
})
export class ProductionAddComponent  implements OnInit {
  title: string = ""
  edit: boolean = false
  montantA: number
  form: FormGroup
  isHidden: boolean = false
  submit: boolean = false
  production: Production
  construction: Construction
  quote: Quote
  quotes: Quote[]
  currentConstruction?: any;
  global = {country: Globals.country, device: Globals.device}
  dataSelected: any[] = [];

  prct = 0;
  finis = 0;
  total = 0;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private quoteService: QuoteService,
    private productionService: ProductionService,
    private constructionService: ConstructionService,
    public toastr: ToastrService,
    private emitter: EmitterService
  ) {
    this.edit = this.productionService.edit
    this.production = this.productionService.getProduction()
    this.title = (!this.edit) ? "Ajouter une realisation" : "Modifier le realisation "+this.production?.construction?.nom
    this.newForm()
   }

  ngOnInit(): void {
    this.editForm()
      if (this.productionService?.construction != null) {
      this.setConstructionUuid(this.productionService?.construction?.uuid);
        this.currentConstruction = {
        title: this.productionService?.construction?.nom,
        detail: this.productionService?.construction?.telephone
      };
    }
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      etat: ['EN COURS', [Validators.required]],
      construction: [null, [Validators.required]],
      options: this.formBuild.array(this.itemOption()),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.productionService.getProduction() }
      this.setConstructionUuid(data.construction.uuid);
       this.construction = data?.construction
      this.currentConstruction = {
        photoSrc: data?.construction?.photoSrc,
        title: data?.construction?.searchableTitle,
        detail: data?.construction?.telephone
      };
      this.finis = 0;
      this.total = 0;
      this.prct = 0;
      this.quoteService.getList(this.f.construction.value,"PRESTATION",null ,1).subscribe((res: any) => {
        res?.forEach((item) => {
          const optionsArray: FormGroup[] = [];
          item.optionProductions.forEach((option) =>{
            this.total++;
            optionsArray.push(  
              this.formBuild.group({
                id: [option.id],
                checked: [{ value: option?.evolution, disabled: option?.evolution ? true : false },[Validators.required]],
                libelle: [{value: option?.libelle, disabled: true}, [Validators.required]],
                statut: [{value: option?.evolution ? 'TERMINER' : 'EN COURS', disabled: true}, [Validators.required]],
                file: [option?.file || null],
                fileName: [option?.fileName || null],
                fileSrc: [option?.fileSrc || null],
              })
            )
            
            if (option?.evolution) {
              this.finis++;      
                 console.log("option?.evolution",option?.evolution, this.finis);   
            } 
          })
          this.option.push(
            this.formBuild.group({
              uuid: [item.uuid],
              prestataire: [{value: item?.provider?.nom, disabled: true}, [Validators.required]],
              devis: [{value: item?.libelle, disabled: true}, [Validators.required]],
              suboptions: this.formBuild.array(optionsArray),
            })
          )

       
        });

        this.prct = Math.floor((this.finis * 100) / this.total);
        console.log(" this.prct", this.finis, this.total);
        
        this.changeColor(this.prct)
        
      }, error => {}
      )

      data.etat = data?.construction ? data?.construction?.etat : data?.construction?.etat;
      data.construction = data?.construction ? data?.construction?.uuid : data?.construction?.uuid;
      this.form.patchValue(data)
     
    }
  }
  setConstructionUuid(uuid) {
    this.f.construction.setValue(uuid);
    if(!this.edit && uuid){
      this.constructionService.getSingle(uuid).subscribe((res: any) => { this.construction = res });
      this.loadQuote();
    }
    if(!uuid){
      this.f.construction.setValue(null);
      this.construction = null
      this.quotes = []
      this.prct = 0
    }
  }

  onCheckItem(item: any, quoteIndex?: number) {
    if (item?.controls?.checked?.value) {
      this.finis ++
      this.prct = Math.floor((this.finis * 100) / this.total);
      this.changeColor(this.prct)
    } else {
      this.finis--
      this.prct = Math.floor((this.finis * 100) / this.total);
      this.changeColor(this.prct)
      // Optionnel : supprimer le fichier si on décoche
      // item.get('file')?.setValue(null);
      // item.get('fileName')?.setValue(null);
      // item.get('fileSrc')?.setValue(null);
    }
  }

  // Calculer la progression pour un devis spécifique
  getQuoteProgress(quoteIndex: number): number {
    const quote = this.option.at(quoteIndex);
    if (!quote) return 0;
    
    const subOptions = quote.get('suboptions') as FormArray;
    if (!subOptions || subOptions.length === 0) return 0;
    
    let total = 0;
    let finis = 0;
    
    subOptions.controls.forEach((subItem) => {
      total++;
      const formGroup = subItem as FormGroup;
      if (formGroup.get('checked')?.value) {
        finis++;
      }
    });
    
    return total > 0 ? Math.floor((finis * 100) / total) : 0;
  }

  // Gérer l'upload de fichier
  onFileSelected(event: any, subItem: FormGroup) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB par exemple)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.toastr.error('La taille maximale autorisée est de 5 Mo', 'Fichier trop volumineux');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const fileSrc = reader.result as string;
        subItem.get('file')?.setValue(file);
        subItem.get('fileName')?.setValue(file.name);
        subItem.get('fileSrc')?.setValue(fileSrc);
      };
      reader.onerror = () => {
        this.toastr.error('Erreur lors de la lecture du fichier', 'Erreur');
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }

  // Supprimer le fichier uploadé
  removeFile(subItem: FormGroup, fileInput?: HTMLInputElement | null) {
    subItem.get('file')?.setValue(null);
    subItem.get('fileName')?.setValue(null);
    subItem.get('fileSrc')?.setValue(null);
    if (fileInput) {
      fileInput.value = '';
    }
    this.toastr.success('Fichier supprimé', 'Succès');
  }

  checkIfAllChecked() {
    const allCheckboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    const allChecked = Array.from(allCheckboxes).every((checkbox) => (checkbox as HTMLInputElement).checked);
    const checkAllCheckbox = document.getElementById('checkAll') as HTMLInputElement;
    if (checkAllCheckbox) {
      checkAllCheckbox.checked = allChecked;
    }
  }

  updateAllCheckboxes(isChecked: boolean) {
    const checkboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = isChecked;
    });
  }

  loadQuote(){
    this.option.controls = []
    if(this.f.construction.value){
      this.quoteService.getList(this.f.construction.value,"PRESTATION",null ,1).subscribe((res: any) => {
        this.quotes = res;
        if(this.quotes && !this.edit){
          this.option.controls = this.itemOption()
        }
        }, error => {}
      );
    }
  }

  changeColor(prct){
    if (prct<50) {
      return "bg-danger"
    }else if (prct>=50 && prct<=90 ) {
      return "bg-warning"
    } else {
      return "bg-success"
    }
  } 

  itemOption(): FormGroup[] {
    const arr: any[] = []
    if(this.quotes && this.quotes.length > 0){
      this.quotes.forEach((item) =>{
        const optionsArray: FormGroup[] = [];
        item.optionProductions.forEach((option) =>{
          if(option?.evolution == true){
            this.finis++;
        }
        this.total++;
          optionsArray.push(
            this.formBuild.group({
              id: [option.id],
              checked: [{ value: option?.evolution, disabled: option?.evolution ? true : false },[Validators.required]],
              libelle: [{value: option?.libelle, disabled: true}, [Validators.required]],
              statut: [{value: option?.evolution ? 'TERMINER' : 'EN COURS', disabled: true}, [Validators.required]],
              file: [option?.file || null],
              fileName: [option?.fileName || null],
              fileSrc: [option?.fileSrc || null],
            })
          )
        })
        arr.push(
          this.formBuild.group({
            uuid: [item.uuid],
            prestataire: [{value: item?.provider?.nom, disabled: true}, [Validators.required]],
            devis: [{value: item?.libelle, disabled: true}, [Validators.required]],
            suboptions: this.formBuild.array(optionsArray),
          })
        )
      })
      if(this.finis>0){
        this.prct = Math.floor((this.finis * 100) / this.total);
    }
      console.log(this.prct);
      
    }
    return arr;
  }

  // Créer une nouvelle subOption vide
  createNewSubOption(): FormGroup {
    return this.formBuild.group({
      id: [null],
      checked: [false, [Validators.required]],
      libelle: ['', [Validators.required]],
      statut: [{value: 'EN COURS', disabled: true}, [Validators.required]],
      montant: [0, [Validators.required]],
      file: [null],
      fileName: [null],
      fileSrc: [null]
    });
  }

  // Ajouter une nouvelle tâche à un groupe d'options spécifique
  addSubOption(optionIndex: number) {
    const subOptionsArray = this.subOption(optionIndex);
    subOptionsArray.push(this.createNewSubOption());
    this.total++;
    this.recalculateProgress();
  }

  // Supprimer une tâche
  removeSubOption(optionIndex: number, subOptionIndex: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cette tâche ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (!result.dismiss) {
        const subOptionsArray = this.subOption(optionIndex);
        const subOption = subOptionsArray.at(subOptionIndex);
        
        // Si la tâche était cochée, décrémenter le compteur
        if (subOption.get('checked')?.value) {
          this.finis--;
        }
        
        subOptionsArray.removeAt(subOptionIndex);
        this.total--;
        this.recalculateProgress();
      }
    });
  }

  // Recalculer la progression
  recalculateProgress() {
    if (this.total > 0) {
      this.prct = Math.floor((this.finis * 100) / this.total);
    } else {
      this.prct = 0;
    }
  }

  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.productionService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'PRODUCTION_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PRODUCTION_ADD', payload: res?.data});
          }
        }
      });
    } else { return; }
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

  get f() { return this.form.controls }
  get option() { return this.form.get('options') as FormArray; }
  subOption(empIndex:number) : FormArray {
    return this.option.at(empIndex).get("suboptions") as FormArray
  }
  
}
