import { FolderFiles } from '@model/folder-files';
import { Ticket } from './ticket';
import { User } from './user';

export interface Chat {
  uuid?: any;
  id?: any;
  type?:string;
  message?: Text;
  createdAt?: Date;
  ticket?: Ticket;
  user?: User;
  folder?: FolderFiles;
}
