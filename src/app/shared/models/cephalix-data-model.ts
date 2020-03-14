
export class Customer {
    id: number = 0;
    uuid: string = '';
    name: string = '';
    name2: string = '';
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
    name: string = '';
    id: number = 0;
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
    deleted: string = '';
    adminPW: string = '';
    cephalixPW: string = '';
    recDate: any = new Date();
    customerId: number = 0;
    constructor() {}
}

export class Ticket{
    id: number = 0;
    cephalixInstituteId: number = 0;
    ossuserId: number = 0;
    ownerId: number = 0;
    title: string = "";
    ticketType: string = "";
    firstname: string = "";
    lastname: string = "";
    email: string = "";
    priority: number = 0;
    recDate: any = new Date();
    status: string = "";
    constructor() {}
}

export class Article{
    id: number = 0;
    cephalixArticleId: number = 0;
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

export class Repository{
    id: number = 0;
    name: string = "";
    repositoryType: string = "";
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
    careMessageType: string = "";
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

export interface Notice{
    tite: string, 
    noticeType: string, 
    text: string
}

