
/**
 * Thes session modell
 * @description The object recived if the login was succesfull.
 */
export interface UserResponse {
  userId: number,
  token: string,
  mac: string,
  name: string,
  role: string,
  dnsname: string,
  roomId: string,
  roomName?: string,
  instituteName?: string,
  mustChange: boolean,
  commonName: string,
  acls: string[]
}

/**
 * The LoginForm intefrace 
 * @description variables used to login  
 */
export interface LoginForm {
  username: string,
  password: string,
}

export interface ServerResponse {
        id: number,
        code: string,
        value: string,
        sessionId: number,
        objectId: number,
        parameters: string[]

}

export class CrxActionMap {
	objectIds: number[] = [];
	booleanValue: boolean= true;
	longValue: number= 0;
	name: string = "";
	stringValue  = "";
}

export class Settings {
        agGridThema: string = "ag-theme-alpine";
        lang: string = "";
        errorMessageDuration: number = 10;
        okMessageDuration: number = 10;
        warningMessageDuration: number = 6;
        rowHeight = 35;
        rowMultiSelectWithClick: boolean = true;
        checkboxSelection: boolean = true;
	headerCheckboxSelection: boolean = true;
	debug: boolean = false;
        constructor() { }
}

export class Acl {
        id: number;
        acl: string = "";
        allowed: boolean = true;
        userId: number;
        groupId: number;
}

export class ServiceStatus {
        service: string;
        enabled: string;
        active: string;
}
export const TOKEN = 'cranix-token';
