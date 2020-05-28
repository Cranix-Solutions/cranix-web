export class IncomingRules {
    other: string ="";
    ssh: boolean = false;
    admin: boolean = false;
    https: boolean = false;
    rdesktop: boolean= false;
    constructor() { }
}

export class OutgoingRule {
    id?: number;
    type: string = "room";
    name: string="";
    dest: string ="0/0";
    prot: string = "tcp";
    port: string = "all";
    constructor() { }
}

export class RemoteAccessRule {
    id?: number;
    name: string="";
    ext: string="";
    port: string ="";
    constructor() { }
}

