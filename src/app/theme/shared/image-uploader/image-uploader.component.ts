import {environment} from '@env/environment';
import {UploaderService} from '@service/uploader/uploader.service';
import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  publicUrl = environment.publicUrl;
  error = false;
  verif = false;
  background = null;
  folder = null;
  data = null;
  percent = 0;
  success = false;
  false = false;
  downloaded = [];
  files = [];
  isUploading = false;
  private sliceSize = 1024 * 1024 * 2;
  fileId = null;
  @Input() maxSize: number = 2;
  @Input() photo = null;
  @Input() name = null;
  @Input() class = null;
  @Input() type = ['image/png', 'image/x-png', 'image/pjpeg', 'image/jpg', 'image/jpeg', 'image/gif'];
  @Input() message = 'Selectionnez une photo';
  @Output() filesd = new EventEmitter()
  @Output() imageUploaded = new EventEmitter();
  @Output() editFile = new EventEmitter();

  constructor(
    public toastr: ToastrService,
    private uploader: UploaderService
  ) {
  }

  ngOnInit(): void {
    this.editFile.emit(false)
    if (this.photo && typeof this.photo === 'object') {
      if (this.photo.hasOwnProperty('fullPath')) {
        this.background = 'url(' + this.publicUrl + '/' + this.photo.fullPath + ') no-repeat center/cover';
      }
    }
  }

  uploadImage(files): void {
    if (files.length <= 0) {
      this.message = 'Selectionnez une photo';
      this.toast(this.message, 'Attention !', 'warning');
      return;
    }
    const file = files[0];

    //On calcul le nombre de Mega en fonction du nbr d'octet defini
    const maxSize = this.maxSize * 1024 * 1024;
    if(file.size > maxSize) {
      this.toast('La taille maximale autorisé est de '+ this.maxSize + ' Mo', 'Taille de fichier non autorisé !', 'error');
      return;
    }

    let typeFile = '';
    if (this.type.indexOf(file.type) === -1) {
      this.type.forEach((res, index) => {
        let i = index + 1;
        const split = res.split('/');
        typeFile += '.' + split[1] + (i < this.type.length ? ', ' : '');
      })
      this.message = 'Seul les formats suivant sont autorisées pour les images, '+ typeFile;
      this.toast(this.message, 'Type de fichier non autorisé !', 'error');
      this.editFile.emit(true)
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      this.background = 'url(' + reader.result + ') no-repeat center/cover';
    });
    reader.readAsDataURL(file);

    this.isUploading = true;
    this.error = false;
    this.success = false;

    const datas = {
      file : file,
      id: this.fileId,
      uniqId: this.uploader.generateId(),
      currentChunk: 0,
      start: 0,
      loaded: 0,
      name: this.name,
      entity: this.class,
      end: this.sliceSize,
      sent: 0,
      count: Math.ceil(file.size / this.sliceSize),
      nextSlice: null,
      xhr: null,
      percent: 0,
      refreshAttempt: 0,
    };
    this.send(datas)
  }

  send(todo) {
    todo.end = todo.start + this.sliceSize;
    if (todo.end > todo.file.size) {
      todo.end = todo.file.size;
    }

    const blob = todo.file.slice(todo.start, todo.end);
    let reader = new FileReader();
    reader.onloadend = (ev) => {
      if (ev.target.readyState !== FileReader.DONE) {
        return null;
      }
      const chunk = ev.target.result as string;
      this.filesd.emit(
        this.data = {
          todo: todo,
          chunk: chunk
        }
      );
      this.success = true;
    };
    reader.readAsDataURL(blob);
  }
  removeFile(file): void {
  }
  delete(){
    this.filesd.emit(null);
    this.background = null
    this.message = 'Selectionnez une photo';
    this.success = false
    this.isUploading = false
  }
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
}
