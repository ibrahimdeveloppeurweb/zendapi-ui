import { ToastrService } from 'ngx-toastr';
import {environment} from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError, Observer } from 'rxjs';
import { UploaderService } from '@service/uploader/uploader.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-folder-upload-2',
  templateUrl: './folder-upload-2.component.html',
  styleUrls: ['./folder-upload-2.component.scss']
})
export class FolderUpload2Component implements OnInit {
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
  fileUpload = []
  @Input() folder = null;
  @Input() etat: string = '';
  @Input() allowFileUpload = true;
  @Input() allowDownload = true;
  @Input() maxSize: number = 3;
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
    this.push(files, allowedTypes);
  }
  push(files = [], allowedTypes ?: []): void {
    let array = Array.from(files); // Convertir en tableau
    array.forEach((item:any) => {
      this.fileUpload.push(item)
    })
    this.uploadfiles(this.fileUpload, allowedTypes)
  }
  uploadfiles(files:any, allowedTypes:any) {
    let promises: Promise<any>[] = [];
    let datas: any[] = [];

    files.forEach((item: any) => {
      promises.push(this.readFileAsDataURL(item));
    });

    Promise.all(promises)
      .then((results) => {
        datas = results;
        this.filesUploaded.emit(datas);
      })
      .catch((error) => {
        // Gérer les erreurs ici si nécessaire
      });
  }
  readFileAsDataURL(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result;
        const dataObject = {
          loaded: 0,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          chunk: base64Data,
          uniqId: this.generateUniqueID()
        };
        resolve(dataObject);
      };
      reader.addEventListener('load', (e) => {
        this.todos.push({
          file: file,
          background: 'url(' + reader.result + ') no-repeat center/cover'
        });
      });
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
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
    this.todos.splice(i, 1)
  }

  remove(todo, i): void {
    this.files.push(todo)
    this.downloaded.splice(i, 1)
  }

  clearfiles(): void {
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
  generateUniqueID(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars.charAt(randomIndex);
    }

    return result;
  }
}
