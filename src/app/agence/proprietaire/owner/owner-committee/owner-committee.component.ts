import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerService } from '@service/owner/owner.service';
import { environment } from '@env/environment';
import { HouseService } from '@service/house/house.service';

@Component({
  selector: 'app-owner-committee',
  templateUrl: './owner-committee.component.html',
  styleUrls: ['./owner-committee.component.scss']
})
export class OwnerCommitteeComponent implements OnInit {

  form: FormGroup;

  user: any;

  title: string = ""

  selectedOwner: any
  selectedHouse: any
  houses: any[] = []
  house: any

  required = Globals.required;

  global = {country: Globals.country, device: Globals.device}
  
  committees: any[] = []

  canLoadCommittees: boolean = false

  isLoadingCommittees: boolean = false

  dtOptions: any = {};

  urlBase = environment.publicUrl

  totalAttendu = 0
  totalRecouvre = 0
  reste = 0
  commission = 0
  taux = 0

  constructor(
    private auth: AuthService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private ownerService: OwnerService,
    private houseService: HouseService
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    console.log(this.user);
    this.newForm();
    console.log(this.form.getRawValue())
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  newForm() {
    this.form = this.formBuild.group({
      type: ['SELECTED', [Validators.required]],
      owner: [null],
      house: [null],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      agency: [this.user.agencyKey, [Validators.required]]
    });
  }

  setOwnerUuid(uuid) {
    console.log(uuid)
    if (uuid) {
      this.f.owner.setValue(uuid)
      this.loadHouses()
      this.canLoadCommittees = true
    } else {
      this.f.owner.setValue(null)
      this.canLoadCommittees = false
      this.committees = []
    }
  }

  setType(value) {
    if (value) {
      this.f.type.setValue(value)
    } else {
      this.f.type.setValue('SELECTED')
    }
  }

  setHouseUuid(value){
    this.house = this.houses.find(item => {
      if (item.uuid === value) {
        this.f.house.setValue(item.uuid);
        return item;
      }
    });
  }

  loadHouses() {
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

  loadCommittees() {
    this.isLoadingCommittees = true
    if (!this.form.invalid) {
      this.committees = []
      let data = this.form.getRawValue()
      console.log(data)
      this.ownerService.getCommittees(data).subscribe((res) => {
        console.log(res)
        if (res) {
          this.isLoadingCommittees = false
          this.committees = res
          if (this.committees && this.committees.length > 0) {
            this.committees.forEach((committee) => {
              this.totalAttendu += committee.totalAttendu
              this.totalRecouvre += committee.totalRecouvre
              this.reste += committee.reste
              this.commission += committee.commission
              this.taux += committee.taux
            })
          }
        }
      })
    } else {
      setTimeout(() => {
        this.isLoadingCommittees = false
      }, 3000)
    }
  }

  print() {
    let data = this.form.getRawValue()
    console.log(data)
    let url = this.urlBase + '/printer/agency/owner/committees/' + this.user.agencyKey + '/' + this.user.uuid + '/' + data.owner + '/' + data.house + '/'  + data.dateD + '/' + data.dateF;
    // let url = this.urlBase + '/printer/agency/owner/committees/' + this.user.agencyKey + '/' + this.user.uuid + '/' + data.owner + '/' + data.house ;
    console.log(url)
    window.open(`${url}`, '_blank');
  }

  onClose(){
    this.modal.close('ferme');
  }

  get f() { return this.form.controls; }
}
