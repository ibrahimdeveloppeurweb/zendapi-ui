import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashViewerService {
  public form = null;
  public entity =null;
  public title =null;
  public uuid: string = ''
  public tabsValue: any[] = []
  public tabsLibelle: any[] = []
  public value: string = null
  public chiffreA: string = null
  public marge: string = null
  public coutC: string = null
  public chiffreR: string = null

  constructor() { }
}
