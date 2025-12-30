
import {House} from '@model/house';
import {Owner} from '@model/owner';
import {ToastrService} from 'ngx-toastr';
import {Repayment} from '@model/repayment';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseService } from '@service/house/house.service';
import { OwnerService } from '@service/owner/owner.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RepaymentService} from '@service/repayment/repayment.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Mandate } from '@model/mandate';
import { MandateService } from '@service/mandate/mandate.service';

@Component({
  selector: 'app-repay-add',
  templateUrl: './repay-add.component.html',
  styleUrls: ['./repay-add.component.scss']
})
export class RepayAddComponent implements OnInit {
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;

  ownerSelected?: any;
  customerSelected?: any;

  owner?: Owner;
  house?: House;
  mandate?: Mandate;
  repayment?: Repayment;
  
  options: any[] = [];
  houses: House[] = [];staticData = [
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    },
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    },
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    },
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    },
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    },
    {
      locataire: 'Jean Dupont',
      libelleFacture: 'Facture Janvier 2024',
      loyerBrut: 1200,
      loyerNet: 1000,
      loyerNetReverse: 800,
      soldeLoyerNet: 200,
      charges: 100,
      chargesReversees: 50,
      soldeCharges: 50,
      commission: 100,
      tvaCommission: 20,
      montantTotalReverser: 870
    },
    {
      locataire: 'Marie Curie',
      libelleFacture: 'Facture Février 2024',
      loyerBrut: 1500,
      loyerNet: 1300,
      loyerNetReverse: 1100,
      soldeLoyerNet: 200,
      charges: 150,
      chargesReversees: 100,
      soldeCharges: 50,
      commission: 130,
      tvaCommission: 26,
      montantTotalReverser: 1174
    }
  ];

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private ownerService: OwnerService,
    private houseService: HouseService,
    private mandateService: MandateService,
    private repaymentService: RepaymentService
  ) {
    this.edit = this.repaymentService.edit;
    this.repayment = this.repaymentService.getRepayment();
    this.title = (!this.edit) ? 'Ajouter un reversement' : 'Modifier le reversement de type ' + this.repayment?.type + ' N°' +this.repayment?.code;
    this._newForm();
  }

  ngOnInit(): void {
  }
  _newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      selectAll: [false],
      owner: [null, [Validators.required]],
      house: [null, [Validators.required]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      invoices: this.formBuild.array([])
    });
  }
  _setOwnerUuid(uuid) {
    if (uuid) {
      this.f.owner.setValue(uuid);
      this.ownerService.getSingle(uuid).subscribe((res: any) => {
        if(res) {
          this.owner = res
        }
      });
      this._loadHouses();
    } else {
      this.houses = [];
      this.owner = null;
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
    }
  }
  _loadHouses() {
    this.houses = [];
    this.f.house.setValue(null)
    if (this.f.owner.value) {
      this.houseService.getList(this.f.owner.value, 'LOCATION', 'OCCUPE', null).subscribe(
        res => {
          this.houses = res;
          return this.houses;
        }, error => {
      });
    }
  }
  _setHouseUuid(item) {
    this.mandate = null
    if (item) {
      this.house = this.houses.find(el => el.uuid === item);
      console.log(this.house)
      if(this.house){
        this.mandateService.getSingle(this.house?.mandate?.uuid).subscribe(res => {
          if (res) {
            this.mandate = res;
            return this.mandate;
          }else {
            Swal.fire({
              title: "Désolée !!!",
              text: "Aucun mandat n'a été  trouvé pour le bien selectionner!",
              icon: "warning"
            });
          }
        }, error => {});
      }
    }
  }

  // Fonction pour recupere les facture lie au filtre
  _onFilter(){
    console.log(this.form.getRawValue())
  }

  
  onSubmit() {
    this.submit = true;
    // if (!this.form.invalid) {
    //   const data = this.form.getRawValue();
    //   this.repaymentService.add(data).subscribe(res => {
    //     if (res?.status === 'success') {
    //       this.modal.close('ferme');
    //       if (data?.uuid) {
    //         this.emitter.emit({action: 'REPAYMENT_UPDATED', payload: res?.data});
    //       } else {
    //         this.emitter.emit({action: 'REPAYMENT_ADD', payload: res?.data});
    //       }
    //     }
    //   });
    // } else { return; }
  }
  onConfirme() {
    // Swal.fire({
    //   title: '',
    //   text: 'Confirmez-vous l\'enregistrement ?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   showCloseButton: true,
    //   confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
    //   cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
    //   confirmButtonColor: '#1bc943',
    //   reverseButtons: true
    // }).then((willDelete) => {
    //   if (!willDelete.dismiss) {
    //     console.log('confirmed')
    //     this.onSubmit();
    //   }
    // });
  }
  onClose(){
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
  get f() { return this.form.controls; }
  get invoices() { return this.form.get('invoices') as FormArray; }
}
