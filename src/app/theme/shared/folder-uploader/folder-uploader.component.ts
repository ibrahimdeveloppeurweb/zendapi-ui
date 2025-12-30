import { ToastrService } from 'ngx-toastr';
import {environment} from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError, Observer } from 'rxjs';
import { UploaderService } from '@service/uploader/uploader.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-folder-uploader',
  templateUrl: './folder-uploader.component.html',
  styleUrls: ['./folder-uploader.component.scss']
})
export class FolderUploaderComponent implements OnInit {
  allDelete: boolean = false;
  save: boolean = false;
  fileUuid = null;
  folderUuid = null;
  downloaded = [];
  todos = [];
  files = [];
  imageTypes = ['image/png', 'image/x-png', 'image/pjpeg', 'image/jpg', 'image/jpeg', 'image/gif'];
  base64Image: any;
  @Input() type = [
    'image/png', 'image/x-png', 'image/pjpeg', 'image/jpg', 'image/jpeg', 'image/gif',
    'application/octet-stream', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/excel', 'application/msexcel', 'application/x-msexcel', 'application/x-ms-excel', 'application/x-excel',
    'application/x-dos_ms_excel', 'application/xls', 'application/x-xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  @Input() folder = null;
  @Input() etat: string = '';
  @Input() path = null;
  @Input() allowFileUpload = true;
  @Input() allowDownload = true;
  @Input() maxSize: number = 3;
  @Output() filesd = new EventEmitter();
  @Output() filesUploaded = new EventEmitter();

  public endPoint = environment.publicUrl + '/';
  publicUrl = environment.publicUrl;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private uploader: UploaderService
  ) {
  }

  ngOnInit(): void {
    if (this.folder && typeof this.folder === 'object') {
      if (this.folder.hasOwnProperty('uuid')) {
        this.folderUuid = this.folder.uuid;
        if (this.folder.files) {
          this.folder.files.forEach(item => {
            this.downloaded.push({
              uuid: item?.uuid,
              name: item?.realName,
              path: item?.fullPath,
              img: 'url(' + this.publicUrl + '/' + item?.fullPath + ') no-repeat center/cover',
              extention: this.setExtentionFile(item?.type)
            })
          });
        }
      }
    }
  }

  async uploadFiles(files, allowedTypes ?: []) {
    if (files.length <= 0) {
      return;
    }
    if (this.folderUuid === null) {
      this.createFolder().subscribe(data => {
        if (data.hasOwnProperty('status') && data.hasOwnProperty('uuid')) {
          if (data.status === 'success') {
            this.folderUuid = data.uuid;
            this.push(files, allowedTypes);
          }
        }
      });
    } else {
      this.push(files, allowedTypes);
    }
  }

  push(files, allowedTypes ?: []): void {
    var i = 0;
    for (const file of files) {
      i++;
      if (allowedTypes) {
        this.type = allowedTypes;
      }

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
        this.toast('Seul les formats suivant sont autorisées pour les documents, '+ typeFile, 'Type de fichier non autorisé !', 'error');
        return;
      }

      const todo = {
        file,
        id: this.uploader.generateId(),
        percent: 0,
        finished: false,
        failed: false,
        fileId: null,
        src: null
      };
      if (this.imageTypes.indexOf(file.type) !== -1) {
        this.setDataUrl(todo);
      }
      this.todos.push(todo);
      this.uploader.on('uploadStart', (data) => {
      });
      this.uploader.on('chunkSent', (data) => {
        const index = this.todos.findIndex(x => x.id === data.id);
        if (index !== -1) {
          this.todos[index].percent = data.percent;
        }
      });
      this.uploader.on('uploadSuccess', (data) => {
        const index = this.todos.findIndex(x => x.id === data.id);
        if (index !== -1) {
          this.todos[index].percent = '100';
          this.todos[index].finished = true;
          this.todos[index].fileId = data.serverFileId;
        }
      });

      this.uploader.on('error', (data) => {
        const index = this.todos.findIndex(x => x.id === data.id);
        if (index !== -1) {
          this.todos[index].percent = data.percent;
          this.todos[index].finished = false;
          this.todos[index].failed = true;
        }
        this.toast('Le fichier ' + data.file.name + ' n\'a pas pu être envoyé au serveur', 'Erreur de téléversement', 'error');
      });
      var uuid = this.uploader.upload(todo.file, todo.id, this.folderUuid, this.path);
      var ext = file.type.substring(6,file.type.length)
      var src = uuid+ '.' +ext
      this.todos[i-1].src = src
      this.todos[i-1].path = this.path
      this.filesUploaded.emit(this.folderUuid);
    }

  }

  setDataUrl(todo) {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      todo.background = 'url(' + reader.result + ') no-repeat center/cover';
    });
    reader.readAsDataURL(todo.file);
  }

  retry(oldTodo): void {
    const todo = {...oldTodo, percent: 0, finished: false, failed: false, fileId: null};
    this.todos.push(todo);
  }

  terminate(){
    this.save = !this.save
    if (this.save === false) {
      if (this.allDelete === true) {
        this.filesUploaded.emit('DELETE');
      }
      this.filesd.emit(this.files);
    }
  }

  allRemove(){
    this.allDelete = true
    if (this.folder?.files?.length > 0) {
      this.folder?.files.forEach(item => {
        this.files.push({
          uuid: item?.uuid,
          name: item?.realName,
          path: item?.fullPath,
          img: 'url(' + this.publicUrl + '/' + item?.fullPath + ') no-repeat center/cover'
        })
      });
    }
    this.downloaded = [];
  }

  removeNew(todo,i){
    this.uploader.deleteFile(todo).subscribe(res =>{
      if(res){
        if (res?.status === "success") {
          this.toast('Image supprimé avec success', 'Opération effectué', 'success');
        }
      }
    });
    this.todos.splice(i, 1)
  }

  remove(todo, i): void {
    this.files.push(todo)
    this.downloaded.splice(i, 1)
  }

  clearFiles(): void {
    this.folderUuid=null;
    this.files=[];
    this.downloaded=[];
    this.todos=[];
  }

  isFinished(): boolean {
    this.todos.forEach((todo) => {
      if (!todo.finished) {
        return false;
      }
    });
    return true;
  }

  createFolder(): Observable<any> {
    return this.api._get(`uploader/create/folder`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  removeFile(todo, index): void {
    this.queryDeletion(todo).subscribe(data => {
      if (data.hasOwnProperty('status')) {
        if (data.status === 'success') {
          const index = this.todos.findIndex(x => x.id === todo.id);
          if (index !== -1) {
            this.todos.splice(index, 1);
          } else {
            const index2 = this.downloaded.findIndex(x => x.uuid === todo.uuid);
            if (index2 !== -1) {
              this.downloaded.splice(index2, 1);
            }
          }
        }
      }
    });
  }

  queryDeletion(todo): Observable<any> {
    return this.api._get('uploader/delete/file/' + todo.fileId).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  downloadFile(file) {
    let imageUrl = this.endPoint + file.fullPath;
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");
      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", file.realName);
      link.click();
    });
  }

  download(todo){
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
  setExtentionFile(type) {
    if (type == 'application/pdf') {
      return 'pdf'
    } else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'word'
    } else if (type == 'image/png'|| type == 'image/x-png' || type == 'image/pjpeg' || type == 'image/jpg'|| type == 'image/jpeg' || type == 'image/gif') {
      return 'image'
    } else if ( type == 'application/excel' || type ==  'application/msexcel' || type ==  'application/x-msexcel' || type ==  'application/x-ms-excel' || type == 'application/x-excel' ||
    type ==  'application/x-dos_ms_excel' || type ==  'application/xls' || type ==  'application/x-xls' || type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type ==  'application/vnd.ms-excel') {
      return 'excel'
    } else {
      return 'undefind'
    }
  }
  setIconByExtention(ext) {
    if (ext == 'pdf') {
      return 'fas fa-file-pdf'
    } else if (ext == 'image') {
      return 'fas fa-file-image'
    } else if (ext == 'word') {
      return 'fas fa-file-alt'
    } else if (ext == "excel") {
      return 'fas fa-file-excel'
    }
  }
  showFile(item) {
    this.uploader.setDataFileByFolder(item);
  }
}
