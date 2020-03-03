
export class Customer {
    id: number = 0;
    uuid: string = '';
    address1: string = '';
    address2: string = '';
    category: string = '';
    locality: string = '';
    contact: string = '';
    country: string = '';
    description: string = '';
    name: string = '';
    name2: string = '';
    postalCode: string = '';
    recDate: any = new Date();
    state: string = '';
    telephone: string = '';
    constructor() {}
}

export class Institute {
    id: number;
    uuid: string;
    adminPW: string;
    anonDhcpNetwork: string;
    cephalixPW: string;
    domain: string;
    firstRoom: string;
    gwTrNet: string;
    ipAdmin: string;
    ipBackup: string;
    ipGateway: string;
    ipMail: string;
    ipPrint: string;
    ipProxy: string;
    ipTrNet: string;
    ipVPN: string;
    locality: string;
    name: string;
    network: string;
    serverNetwork: string;
    nmTrNet: string;
    type: string;
    deleted: string;
    recDate: any = new Date();
    validity: any = new Date();
    ayTemplate: string;
    customerId: number;
    regCode: string;
    constructor() {
        this.id = 0;
        this.uuid = '';
        this.adminPW = '';
        this.anonDhcpNetwork = '';
        this.cephalixPW = '';
        this.domain = '';
        this.firstRoom = '';
        this.gwTrNet = '';
        this.ipAdmin = '';
        this.ipBackup = '';
        this.ipGateway = '';
        this.ipMail = '';
        this.ipPrint = '';
        this.ipProxy = '';
        this.ipTrNet = '';
        this.ipVPN = '';
        this.locality = '';
        this.name = '';
        this.network = '';
        this.serverNetwork = '';
        this.nmTrNet = '';
        this.type = '';
        this.deleted = '';
        this.recDate = new Date();
        this.validity = new Date();
        this.ayTemplate = '';
        this.customerId = 0;
        this.regCode = '';
    }
}

export class Ticket{
    id: number = 0;
    cephalixInstituteId: number = 0;
    ossuserId: number = 0;
    ownerId: number = 0;
    type: string = "";
    firstname: string = "";
    lastname: string = "";
    email: string = "";
    title: string = "";
    priority: number = 0;
    recDate: any = new Date();
    status: string = "";
    constructor() {}
}

export class Article{
    id: number = 0;
    cephalixInstituteId: number = 0;
    sender: string = "";
    recipient: string = "";
    title: string = "";
    type: string = "";
    seen: boolean = false;
    text: string = "";
    recDate: any = new Date();
    reminder: any = new Date();
    workTime: number = 0;
    constructor() {}
}
export class Repository{
    id: number = 0;
    name: string = "";
    type: string = "";
    description: string = "";
    repository: string = "";
    constructor() {}
}

export class OssCare{
    id: number = 0;
    cephalixInstituteId: number = 0;
    description: string = "";
    access: string = "";
    contact: string = "";
    recDate:  any = new Date();
    validity: any = new Date();
    constructor() {}
}

export class OssCareMessage{
    id: number = 0;
    cephalixosscareId: number = 0;
    recDate: any = new Date();
    type: string = "";
    description: string = "";
    text: string = "";
    constructor() {}
}

export class DynDns {
    id: number = 0;
    cephalixinstituteId: number = 0;
    hostname: string = "";
    domain: string = "";
    ip: string = "";
    port: string = "";
    ro: boolean = false;
    constructor() {}
}

export interface CopyFile {
    instituteIds: number [],
    directory: string,
    mode: string,
    execute: boolean,
    file: File
}

export interface Object {
    id: number,
    cephalixId: number,
    objectType: string,
    objectName: number,
    ossId: number,
    instituteId: number,
    lastSync: number
}

export interface Note{
    tite: string, 
    type: string, 
    text: string
}

