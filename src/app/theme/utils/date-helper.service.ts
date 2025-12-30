import {DateRanges} from '@theme/enums/date-ranges.enum';
import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import {AbstractControl} from '@angular/forms';
import 'moment/locale/fr';

export const FILTER_API_DATE_FORMAT = 'YYYYMMDDHHmmss';
export const DISPLAY_DATE_FORMAT = 'MM/DD/YYYY';
export const TABLE_DISPLAY_DATE_FORMAT = 'MM/DD/YYYY h:mm:ssA';

@Injectable()
export class DateHelperService {
  constructor() {
    moment.locale('fr');
  }

  static addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  static formatDatefromServer(
    dateFromServer,
    momentDateFormat = 'MMMM Do, YYYY [at] h:mm:ss A'
  ) {
    let formattedDate = '';

    try {
      const date = parseInt(dateFromServer, 10);
      formattedDate = moment(date).format(momentDateFormat);
    } catch (e) {
      formattedDate = 'N/A';
    }
    return formattedDate;
  }

  static fromStringToNgbDateStruct(dateStr: string): NgbDateStruct {
    if (!dateStr) {
      return;
    }

    return {
      year: +dateStr.substring(0, 4),
      month: +dateStr.substring(4, 6),
      day: +dateStr.substring(6, 8)
    };
  }

  static fromJsonDate(jDate): string {
    const bDate: Date = new Date(jDate);
    try {
      jDate = bDate.toISOString().substring(0, 10);
    } catch (e) {
    }
    return jDate;

  }

  //------------------
  static getFormatFrenchDateTime(dateformat: any): any {
    return moment(dateformat).format('DD-MM-YYYY HH:mm:ss');
  }

  static getFormatGeneralDateTime(dateformat: any): any {
    return moment(dateformat).format('YYYY-MM-DD HH:mm:ss');
  }

  static getFormatFrenchTime(dateformat: any): any {
    return moment(dateformat).format('HH:mm');
  }
  //------------------

  static fromDateStructToNgbDate(struct: NgbDateStruct) {
    if (!struct) {
      return null;
    }
    return new Date(struct.year, struct.month - 1, struct.day);
  }

  static fromNgbDateStructToMomentDate(struct: NgbDateStruct): moment.Moment {
    if (!struct) {
      return null;
    }
    return moment()
      .year(struct.year)
      .month(struct.month - 1)
      .date(struct.day)
      .hour(0)
      .minute(0)
      .second(0);
  }

  static fromNgbDateStructToStringFormatServer(
    struct: any,
    dateFormat = 'YYYYMMDDHHmmss'
  ) {
    const timestamp = {hour: 0, minute: 0, second: 0};
    if (!struct) {
      return moment.utc().format(dateFormat);
    }
    return moment()
      .year(struct.year)
      .month(struct.month - 1)
      .date(struct.day)
      .hour(timestamp.hour)
      .minute(timestamp.minute)
      .second(timestamp.second)
      .format(dateFormat);
  }

  static readableMonth(date): string {
    if (typeof date === 'string') {
      try {
        date = new Date(date);
      } catch (e) {
        return date;
      }
    }
    if (!date) {
      return;
    }
    const month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    return month[parseInt(date.getMonth(), null)] + ' ' + date.getFullYear();
  }

  static readable(date): string {
    if (typeof date === 'string') {
      try {
        date = new Date(date);
      } catch (e) {
        return date;
      }
    }
    if (!date) {
      return;
    }
    const month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    return date.getDate() + ' ' + month[parseInt(date.getMonth(), null)] + ' ' + date.getFullYear()
      + ' à ' + date.getHours() + ':' + date.getMinutes();
  }

  static getTimeLapse(date, now = null, addPrefix = true, format ?: string): string {

    if (typeof now === 'string') {
      try {
        now = new Date(now);
      } catch (e) {
        throw new Error('Impossible de convertir ' + now + ' en date valide');
      }
    }
    if (!now) {
      now = new Date();
    }
    if (typeof date === 'string') {
      try {
        date = new Date(date);
      } catch (e) {
        throw new Error('Impossible de convertir ' + date + ' en date valide');
      }
    }
    const diff = Math.abs(now - date);
    let text = '';
    const timelapse = {
      y: Math.floor(diff / 1000 / 60 / 60 / 24 / 30 / 12),
      m: Math.floor(diff / 1000 / 60 / 60 / 24 / 30) % 12,
      d: Math.floor(diff / 1000 / 60 / 60 / 24) % 30,
      h: Math.floor(diff / 1000 / 60 / 60) % 24,
      i: Math.floor(diff / 1000 / 60) % 60,
      s: Math.floor(diff / 1000) % 60,
    };
    if (text.trim() === '' || (format && format.includes('y'))) {
      text += timelapse.y > 0 ? timelapse.y + ' an' : '';
      text += timelapse.y > 1 ? 's' : '';
    }
    if (text.trim() === '' || (format && format.includes('m'))) {
      text += timelapse.m > 0 ? ' ' + timelapse.m + ' ' + 'mois' : '';
    }
    if (text.trim() === '' || (format && format.includes('d'))) {
      text += timelapse.d > 0 ? ' ' + timelapse.d + ' jour' : '';
      text += timelapse.d > 1 ? 's' : '';
    }
    if (text.trim() === '' || (format && format.includes('h'))) {
      text += timelapse.h > 0 ? ' ' + timelapse.h + ' heure' : '';
      text += timelapse.h > 1 ? 's' : '';
    }
    if (text.trim() === '' || (format && format.includes('i'))) {
      text += timelapse.i > 0 ? ' ' + timelapse.i + ' minute' : '';
      text += timelapse.i > 1 ? 's' : '';
    }
    if (text.trim() === '' || (format && format.includes('s'))) {
      text += timelapse.s > 0 ? ' ' + timelapse.s + ' seconde' : '';
      text += timelapse.s > 1 ? 's' : '';
    }

    if (addPrefix) {
      const prefix = now - date > 0 ? 'Il y a ' : 'Dans ';
      text = prefix + text;
    }
    return text;
  }


  static convertDateToString(date) {
    return moment(date).utc().format('YYYYMMDD');
  }


  static fromNgbDateStructToString(
    struct: any,
    timestamp = {hour: 0, minute: 0, second: 0},
    dateFormat = 'YYYYMMDDHHmmss'
  ) {
    if (!struct) {
      return moment.utc().format(dateFormat);
    }

    const isToday = moment
      .utc([struct.year, struct.month - 1, struct.day])
      .isSame(moment.utc(), 'day');

    if (isToday) {
      return moment()
        .year(struct.year)
        .month(struct.month - 1)
        .date(struct.day)
        .format(dateFormat);
    }

    return moment()
      .year(struct.year)
      .month(struct.month - 1)
      .date(struct.day)
      .hour(timestamp.hour)
      .minute(timestamp.minute)
      .second(timestamp.second)
      .format(dateFormat);
  }

  static monFormatDateString(string) {
    if (string === '' || string === null || string === undefined) {
      return null;
    }
    var date = new Date(string);
    var jour = ('0' + date.getDate()).slice(-2);
    var mois = ('0' + (date.getMonth() + 1)).slice(-2);
    var annee = date.getFullYear();
    var heur = ('0' + date.getHours()).slice(-2);
    var mint = ('0' + date.getMinutes()).slice(-2);
    var sec = ('0' + date.getSeconds()).slice(-2);
    return annee + '' + mois + '' + jour + '' + heur + '' + mint + '' + sec;
  }

  static monFormatDateReverse(string) {
    if (string === '' || string === null || string === undefined) {
      return null;
    }
    var annee = string.slice(0, 4);
    var mois = string.slice(5, 7);
    var jour = string.slice(8, 10);
    let date = annee + '-' + mois + '-' + jour;
    return date;
  }

  static getDay(string) {
    if (string === '' || string === null || string === undefined) {
      return null;
    }
    let date = new Date(string);
    return date.getDate();
  }

  static monFormatMonthString(string) {
    if (string === '' || string === null || string === undefined) {
      return null;
    }
    var date = new Date(string + '-' + '01');
    var jour = ('0' + date.getDate()).slice(-2);
    var mois = ('0' + (date.getMonth() + 1)).slice(-2);
    var annee = date.getFullYear();
    var dateL = annee + '' + mois + '' + jour;
    return dateL;
  }

  static compareNgbDateStruct(
    startDate: string,
    endDate: string,
    dateFormat = 'YYYYMMDD'
  ) {
    if (!startDate || !endDate) {
      return false;
    }
    var dateD = new Date(startDate);
    var dateF = new Date(endDate);
    const start = moment()
      .year(dateD.getFullYear())
      .month(dateD.getMonth())
      .date(dateD.getDate())
      .format(dateFormat);
    const end = moment()
      .year(dateF.getFullYear())
      .month(dateF.getMonth())
      .date(dateF.getDate())
      .format(dateFormat);
    if (end > start) {
      return true;
    } else {
      return false;
    }
  }

  static formatNgbDateStruct(date) {
    if (date === '' || date === null || date === undefined) {
      return '';
    }
    return moment()
      .year(date.substring(0, 4))
      .month(date.substring(4, 6))
      .date(date.substring(6, 8))
      .format('DD MMMM YYYY');
  }

  static formatNgbMonthStruct(date) {
    return moment()
      .year(date.substring(0, 4))
      .month(date.substring(4, 6))
      .format('MMMM YYYY');
  }

  static fromMomentDateToNgbDateStructTo(mmt = moment.utc()): NgbDateStruct {
    return {
      year: mmt.year(),
      month: mmt.month() + 1,
      day: mmt.date()
    };
  }

  static fromDateToNgbDateStructTo(date): NgbDateStruct {
    const mmt = moment(date);
    return {
      year: mmt.year(),
      month: mmt.month() + 1,
      day: mmt.date()
    };
  }

  static getPresetDateRange(presetDateRange: string) {
    let startDate;
    const endDate = moment();
    switch (presetDateRange) {
      case DateRanges.WEEK:
        startDate = moment().subtract(6, 'days');
        break;
      case DateRanges.MONTH:
        startDate = moment().subtract(1, 'month');
        break;
      case DateRanges.THREE_MONTHS:
        startDate = moment().subtract(3, 'months');
        break;
      case DateRanges.SIX_MONTHS:
        startDate = moment().subtract(6, 'months');
        break;
      case DateRanges.YEAR:
        startDate = moment().subtract(1, 'year');
        break;
    }

    return {
      startDate: DateHelperService.fromMomentDateToNgbDateStructTo(startDate),
      endDate: DateHelperService.fromMomentDateToNgbDateStructTo(endDate)
    };
  }

  static getMinDateStruct() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    };
  }

  static getDefaultDateStruct() {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    };
  }

  static getMaxDateStruct() {
    const now = new Date();
    return {
      year: now.getFullYear() + 1,
      month: now.getMonth(),
      day: now.getDate()
    };
  }

  static getTodayDateStruct(): NgbDateStruct {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
  }

  static fromNgbDateStructToDate(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  static getPastMonthDateStruct(): NgbDateStruct {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    };
  }

  static getPastQuarterDate() {
    const now = moment().subtract(3, 'months');
    return {
      year: now.year(),
      month: now.month() + 1,
      day: now.date()
    };
  }

  static dateValuePrepareFunction(createdAtDate, row) {
    let formattedDate = '';
    try {
      const date = parseInt(createdAtDate, 10);
      formattedDate = moment(date).format('MMMM Do, YYYY h:mm:ss A');
    } catch (e) {
      formattedDate = 'N/A';
    }
    return formattedDate;
  }

  static checkIfEndDateAfterStartDate(c: AbstractControl) {
    if (!c.get('start_date').value || !c.get('end_date').value) {
      return null;
    }
    if (
      DateHelperService.compareNgbDateStruct(
        c.get('start_date').value,
        c.get('end_date').value
      )
    ) {
      return null;
    } else {
      return {invalidEndDate: true};
    }
  }

  static checkIfEndDateAfterStartDateContratTenant(c: AbstractControl) {
    if (!c.get('start_date').value || !c.get('end_date').value) {
      return null;
    }
    if (
      DateHelperService.compareNgbDateStruct(
        c.get('start_date').value,
        c.get('end_date').value
      )
    ) {
      return null;
    } else {
      return {invalidEndDate: true};
    }

  }

  static fromNow(date: Date){
    return moment(date).fromNow();
  }
}
