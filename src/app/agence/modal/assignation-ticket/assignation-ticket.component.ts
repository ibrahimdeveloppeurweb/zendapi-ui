import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { user } from '@model/customer';
import { Ticket } from '@model/ticket';
import { User } from '@model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@service/auth/auth.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { TicketService } from '@service/ticket/ticket.service';
import { UserService } from '@service/user/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-assignation-ticket',
  templateUrl: './assignation-ticket.component.html',
  styleUrls: ['./assignation-ticket.component.scss']
})
export class AssignationTicketComponent implements OnInit {

  user: any;
  title?: string
  form: FormGroup
  submit: boolean = false
  ticket: Ticket
  userId: any
  serviceSelected?: any;
  users: User[]


  urgenceRow = [
    { label: 'URGENT', value: 'URGENT' },
    { label: 'IMPORTANT', value: 'IMPORTANT' },
    { label: 'INTERMEDIAIRE', value: 'INTERMEDIAIRE' }
  ]

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private ticketService: TicketService,
    private emitter: EmitterService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.title = "Assignation Ticket"
    this.getUsers(this.ticketService.ticket.service.nom);
  }
  ngOnInit(): void {
    this.ticket = this.ticketService.getTicket()
    if(this.ticket.user) {
      this.userId = this.ticket.user.id
    } else {
      this.userId = null
    }
    console.log(this.ticket.user)
    this.newForm();
  }
  getUsers(service) {
    this.userService.getList(service, null).subscribe(res => {
      this.users = res;
      return this.users;
    }, error => { });
  }

  setUserUuid(uuid) {
    if (uuid) {
      this.f.user.setValue(uuid);
    }
  }
  newForm() {

    this.form = this.formBuild.group({
      uuid: [null],
      user: [this.userId, [Validators.required]],
      urgence: [this.ticket.urgence, [Validators.required]],
      service: [null, [Validators.required]],
    });
    if (this.ticket.service) {
      this.serviceSelected = {
        title: this.ticketService.ticket.service ? this.ticketService.ticket.service.nom : null,
        detail: this.ticketService.ticket.service ? this.ticketService.ticket.service.nom : null,
      }
      this.f.service.setValue(this.ticketService.ticket.service.uuid)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.f.uuid.setValue(this.ticketService.ticket.uuid)
      this.f.service.setValue(this.ticketService.ticket.service.uuid)
      this.ticketService.assign(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          this.emitter.emit({ action: 'TICKET_ASSIGNED', payload: res?.data });
        }
      }, error => { });
    } else {
      return;
    }
  }
  setServiceUuid(uuid) {
    this.f.service.setValue(uuid);
    if (uuid) {
      this.loadUsers();
    } else {
      this.users = [];
    }
  }

  loadUsers() {
      this.userService.getList(null, this.f.service.value).subscribe(res => {
        this.users = res;
        return this.users;
      }, error => { });

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
  onClose() { this.modal.close('ferme'); }
  get f() { return this.form.controls; }
}
