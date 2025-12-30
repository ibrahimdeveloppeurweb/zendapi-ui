import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '@model/ticket';
import { ChatService } from '@service/chat/chat.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { TicketService } from '@service/ticket/ticket.service';
import { FolderUploaderComponent } from '@theme/shared/folder-uploader/folder-uploader.component';
import { Lightbox } from 'ngx-lightbox';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-chat-add',
  styleUrls: ['./chat-add.component.sass'],
  templateUrl: './chat-add.component.html',

})
export class ChatAddComponent implements OnInit {

  @ViewChild("folderUploader") folderUpload: FolderUploaderComponent;
  @ViewChild("scrollMe") scrollMe: ElementRef;
  
  form: FormGroup
  edit: boolean = false;
  submit: boolean = false;
  loading : boolean = false;
  @Input() ticket: Ticket;
  @Input() showView: boolean = false;
  
  constructor(
    private chatService: ChatService,
    private ticketService: TicketService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private lightbox: Lightbox) { }

    ngOnInit(): void {
      this.newForm()
      this.emitter.event.subscribe((data) => {
        if (data.action === 'CHAT_ADD') {
          this.ticket.chats.push(data.payload);
        }
      });
    }
    newForm() {
      this.form = this.formBuild.group({
        uuid: [null],
        id: [null],
        message: [null, [Validators.required]],
        ticket: [null],
        folders: this.formBuild.array([]),
        folderUuid: [null],
      });
    }
    close(item) {
      Swal.fire({
        title: '',
        text: 'Voulez-vous vraiment fermer cet ticket ?',
        icon: '',
        showCancelButton: true,
        showCloseButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Fermer <i class="feather icon-x"></i>',
        confirmButtonColor: '#d33',
      }).then((willDelete) => {
        if (willDelete.dismiss) {
        } else {
          this.ticketService.close(item.uuid).subscribe(res => {
            this.showView = !this.showView;
            this.emitter.emit({ action: 'TICKET_CLOSED', payload: res });
          }, error => { });
        }
      });
    }
    onSubmit() {
      this.f.ticket.setValue(this.ticket.uuid)
      this.emitter.disallowLoading()
      if (!this.form.invalid) {
        this.loading = true;
        this.chatService.add(this.form.value).subscribe(res => {
          this.emitter.emit({ action: 'CHAT_ADD', payload: res?.data });
          this.loading = false;
          this.clearForm();
        }, error => {
          this.loading = false;
        });
      } else {
        return
      }
    }
    files(data) {
      if (data && data !== null) {
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
    setParam(property, value) {
      if (value) {
        if (this.form.value.hasOwnProperty(property)) {
          Object.assign(this.form.value, { [property]: value });
        }
        if (this.form.controls.hasOwnProperty(property)) {
          this.form.controls[property].setValue(value);
        }
      }
    }
    open(src) {
      const albums = [];
      const album = {
        src: src,
        caption: src,
        thumb: src
      };
      albums.push(album);
      this.lightbox.open(albums, 0);
    }
    clearForm() {
      this.form.reset();
      this.folderUpload.clearFiles();
    }
    get f() { return this.form.controls; }
    get folder() { return this.form.get('folders') as FormArray; }
}
