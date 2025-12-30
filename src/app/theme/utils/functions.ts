export const capitalize = (value: string) => {
  return value.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
};

export const getFileExtension = (filename) => {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
};

export const dateFormat = (date) => {
  const a = date.split('/', 3);
  return a[2] + '-' + a[1] + '-' + a[0];
};

export const formatInputDate = (date) => {
  [date] = new Date(date).toISOString().match(/\d{4}\-\d{2}\-\d{2}/);
  return date;
};

export const findInArray = (array, value) => {
  return array.find(element => element === value) !== undefined;
};

export const findByProp = (array: any[], prop: string, value: any) => {
  return array.find(item => item[prop] === value) || null;
};

export const formatToNumber = (value) => {
  if (value === undefined || value === null) {
    return 0;
  }
  return +value.toString().replace(/ /g, '').replace(',', '.');
};

export const formatToStringNumber = (value: number, decimal = 3) => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '0';
  }
  if (!Number.isInteger(value)) {
    value = +value.toFixed(decimal);
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('.', ',');
};

export const sumArray = (value: any[], property: string = null) => {
  return value.reduce((acc, cv) => acc + (property ? cv[property] : cv), 0);
};

export const sumPropertyArray = (items: any[], properties: string) => {
  return items.reduce((acc, cv) => {
    let value = null;
    properties.split('.').map(property => value = value === null ? cv[property] : value[property]);
    return formatToNumber(value) + acc;
  }, 0);
};

export const somePropertyArray = (items: any[], properties: string, someCallback) => {
  return items.some((element) => {
    let value = null;
    properties.split('.').map(property => value = value === null ? element[property] : value[property]);
    return someCallback(value);
  });
};

export const fileHasExtension = (fileExtensions: string[], file: File) => fileExtensions.includes(getFileExtension(file.name));

export const fileUnderMaxSize = (fileMaxSize: number, file: File) => file.size <= fileMaxSize;

export const round = (value: number, precision: number) => {
  if (value === undefined || value === null) {
    return 0;
  }
  return +value.toFixed(precision);
};
export const VALIDATION = (etat: string) => {
  if (etat === 'INVALIDE') {
    return "EN ATTENTE DE VALIDATION"
  }
  if (etat === 'VALIDE') {
    return "VALIDÉ"
  }
  return etat
};
export const CONFIRMATION = (etat: string) => {
  if (etat === 'ATTENTE') {
    return "EN ATTENTE DE CONFIRMATION"
  }
  return etat
};
export const PAYMENT = (etat: string) => {
  if (etat === 'EN COURS') {
    return "EN COURS DE PAIEMENT"
  }
  if (etat === 'ATTENTE') {
    return "EN ATTENTE DE PAIEMENT"
  }
  return etat
};
