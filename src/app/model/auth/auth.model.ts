import { Permission } from '@model/permission';

export interface DataToken {
  uuid: string;
  token: string;
  isFirstUser: boolean;
  role: string;
  agencyKey: string;
  nom: string;
  photo: string;
  agencyName: string;
  autorisation: any;
  civilite: string;
  country: string;
  device: string;
  email: string;
  isSubscribe: string;
  lastLogin: string;
  permissions: any[];
  prcFrais: number;
  sexe: string;
  telephone: string;
  refreshToken: string;
}

export interface DataLock {
  nom: string;
  sexe: string;
  path: boolean;
  photo: string;
  email: string;
}

export interface RateToken {
  isRatetUser: boolean;
}

export interface PermissionToken {
  permission: Permission;
}

export interface VerifyData {
  email: string;
  pathRedirectUrl: string;
}

export interface ResetToken {
  aud: string;
  jti: string;
  iat: number;
  nbf: number;
  exp: number;
  sub: string;
  email: string;
  scopes: any[];
}

export interface ResetData {
  password: string;
  password_confirm: string;
  user: string;
}

