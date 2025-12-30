import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {AuthService} from '@service/auth/auth.service';
import { ApiService } from '@theme/utils/api.service';
import { map } from 'jquery';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  user: any;
  private assignData;
  private allowedType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
  private isUploading = false;
  private nextSlice = null;
  private startChunk = 0;
  private sliceSize = 1024 * 1024 * 2;
  private maxTunnel = 3;
  private currentFiles = [];
  private xhrTable = [];
  private fileList = [];
  private currentId = null;
  private maxRefreshAttempt: 5;
  private folder;
  private devBreak = 10;
  callbacks = [];
  devCount = 0;
  public endPoint = environment.serverUrl + '/uploader';
  private url = 'uploader';

  constructor(
    private api: ApiService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getDataToken() ? this.authService.getDataToken() : null;
  }

  /*
  Vous pouvez fournir un uniqId afin tracker un fichier
   */
  upload(file, uniqId ?: string, folderUuid ?: string, path ?: string): string {
    const generatedId = this.generateId();
    const todo = {
      file,
      id: uniqId,
      uniqId: generatedId,
      currentChunk: 0,
      start: 0,
      loaded: 0,
      folderUuid: folderUuid,
      path: path,
      end: this.sliceSize,
      sent: 0,
      count: Math.ceil(file.size / this.sliceSize),
      nextSlice: null,
      xhr: null,
      percent: 0,
      refreshAttempt: 0,
    };
    this.send(todo)
    return generatedId;
  }

  remove(todo): void {
    const index = this.currentFiles.findIndex((file) => {
      return file.id === todo.id;
    });
    if (index !== -1) {
      this.currentFiles.splice(index, 1);
    }
    const index2 = this.fileList.findIndex((file) => {
      return file.id === todo.id;
    });
    if (index2 !== -1) {
      this.fileList.splice(index2, 1);
    }
  }

  launchUpload(): void {
    let hasAppend = false;
    while (this.currentFiles.length < this.maxTunnel) {
      if (this.fileList.length === 0) {
        break;
      }
      this.appendTodo();
      hasAppend = true;
    }
    if (!hasAppend && this.currentFiles.length > 0) {
      const todo = this.currentFiles[0];
      this.emit('uploadStart', todo);
      this.send(todo);
    } else {
      this.isUploading = false;
    }
  }

  appendTodo(): void {
    if (this.fileList.length > 0) {
      const todo = this.fileList[0];
      this.currentFiles.push(todo);
      this.fileList.shift();
      this.emit('uploadStart', todo);
      this.send(todo);
    }
  }

  getDelete(data: any): Observable<any> {
    return this.api._post(`${this.url}/folder/delete`, data).pipe(
      catchError((error: any) => throwError(error))
    );
  }

  deleteFile(data: any): Observable<any> {
    return this.api._post(`${this.url}/file/delete`, data).pipe(
      catchError((error: any) => throwError(error))
    );

  }

  apiSend(image: any): Observable<any> {
    return this.api._post(`${this.url}`, image).pipe(
      catchError((error: any) => throwError(error))
    );
  }

  send(todo) {
    this.isUploading = true;
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
      const data = {
        path: todo?.path,
        loaded: todo?.loaded,
        chunk: chunk,
        agency: this.user?.agencyKey,
        fileName: todo?.file?.name,
        fileSize: todo?.file?.size,
        fileType: todo?.file?.type,
        folderUuid: todo?.folderUuid,
        uniqId: todo?.uniqId,
      }
      this.apiSend(data).subscribe(res =>{ })
    };
    reader.readAsDataURL(blob);
  }

  emit(type, data): void {
    if (!this.callbacks.hasOwnProperty(type)) {
      return;
    }
    this.callbacks[type].forEach((callback) => {
      callback(data);
    });
  }

  on(type, callback) {
    if (!this.callbacks.hasOwnProperty(type)) {
      this.callbacks[type] = [];
    }
    if (callback && !this.callbacks[type].includes(callback)) {
      this.callbacks[type].push(callback);
    }
  }

  removeCallBack(type, callback) {
    if (this.callbacks.hasOwnProperty(type)) {
      if (callback && !this.callbacks[type].includes(callback)) {
        this.callbacks[type].splice(this.callbacks[type].indexOf(callback), 1);
      } else {
        this.callbacks[type] = [];
      }
    }
  }

  addCallback(event, callback) {
    if (!this.callbacks.hasOwnProperty(event)) {
      this.callbacks.push({event: []});
    }
    if (!this.callbacks[event].includes(callback)) {
      this.callbacks[event].push(callback);
    }
  }

  generateId() {
    let number = Math.random();
    number.toString(36);
    return number.toString(36).substr(2, 9);
  }
  getDataFileByFolder() {
    return this.assignData;
  }
  setDataFileByFolder(data) {
    this.assignData = data;
  }
}
