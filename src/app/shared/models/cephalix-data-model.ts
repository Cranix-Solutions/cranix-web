
export class Customer {
    id?: number;
    name: string = '';
    name2: string = '';
    uuid: string = '';
    description: string = '';
    category: string = '';
    address1: string = '';
    address2: string = '';
    postalCode: string = '';
    state: string = '';
    locality: string = '';
    country: string = '';
    contact: string = '';
    telephone: string = '';
    recDate: any = new Date();
    constructor() {}
}

export class Institute {
    id?: number;
    name: string = '';
    uuid: string = '';
    instituteType: string = '';
    locality: string = '';
    regCode: string = '';
    validity: any = new Date();
    domain: string = '';
    ayTemplate: string = '';
    internalNetwork: string = '';
    ipVPN: string = '';
    serverNetwork: string = '';
    anonDhcpNetwork: string = '';
    firstRoom: string = '';
    ipAdmin: string = '';
    ipMail: string = '';
    ipPrint: string = '';
    ipProxy: string = '';
    ipBackup: string = '';
    ipGateway: string = '';
    ipTrNet: string = '';
    gwTrNet: string = '';
    nmTrNet: string = '';
    deleted;
    adminPW: string = '';
    cephalixPW: string = '';
    recDate: any = new Date();
    cephalixCustomerId: number = 0;
    constructor() {}
}

export class Ticket{
    id?: number;
    title: string = "";
    cephalixInstituteId: number = 0;
    ossuserId: number = 0;
    ownerId: number = 0;
    ticketType: string = "";
    firstname: string = "";
    lastname: string = "";
    email: string = "";
    priority: number = 0;
    recDate: any = new Date();
    ticketStatus: string = "";
    constructor() {}
}

export class Article{
    id?: number;
    cephalixTicketId: number = 0;
    title: string = "";
    sender: string = "";
    recipient: string = "";
    articleType: string = "";
    seen: boolean = false;
    text: string = "";
    recDate: any = new Date();
    reminder: any = new Date();
    workTime: number = 0;
    constructor() {}
}
export class InstituteStatus {
    id?: number;
    cephalixInstituteId: number = 0;
    created: any = new Date();
    runningKernel: string ="";
    installedKernel: string ="";
    uptime: string ="";
    version: string ="";
    lastUpdate: any =new Date();
    availableUpdates: string = "";
    rootUsage: string ="";
    srvUsage: string = "";
    varUsage: string ="";
    homeUsage: string = "";
    constructor() {}
}
export class Repository{
    id?: number;
    name: string = "";
    repositoryType: string = "";
    description: string = "";
    repository: string = "";
    cephalixInstituteId: number = 0;
    cephalixCustomerId: number = 0;
    constructor() {}
}

export class CrxCare{
    id?: number;
    cephalixInstituteId: number = 0;
    description: string = "";
    access: string = "";
    contact: string = "";
    recDate:  any = new Date();
    validity: any = new Date();
    constructor() {}
}

export class OssCareMessage{
    id?: number;
    cephalixosscareId: number = 0;
    recDate: any = new Date();
    careMessageType: string = "";
    description: string = "";
    text: string = "";
    constructor() {}
}

export class DynDns {
    id?: number;
    cephalixInstituteId: number = 0;
    hostname: string = "";
    domain: string = "";
    ip: string = "";
    port: string = "";
    ro: boolean = false;
    constructor() {}
}

export class Notice{
    id?: number;
    title:       string = "";
    noticeType:  string = "";
    text:        string = "";
    created:     any    = new Date();
    reminder:    any    = new Date();
    workTime:    number = 0;
    invoiced:    boolean= false;
    cephalixInstituteId: number = 0;
    constructor() {}
}

export interface CopyFile {
    instituteIds: number [],
    directory: string,
    mode: string,
    execute: boolean,
    file: File
}

export interface SynchronizedObject {
    id?: number,
    instituteId: number,
    objectType: string,
    objectName: number,
    cephalixId: number,
    ossId: number,
    lastSync: number
}

