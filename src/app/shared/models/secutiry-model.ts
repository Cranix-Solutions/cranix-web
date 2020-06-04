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

export class AccessInRoom  {
    id?: number; 
    roomId: number = 0;
    pointInTime: string ="06:00";
    accessType: string ="DEF";
    action: string =null;
    login: boolean = false;
    portal: boolean = false;
    printing: boolean = false;
    direct: boolean = false;
    proxy: boolean = false;
    monday: boolean = true;
    thursday: boolean = true;
    wednesday: boolean = true;
    tuesday: boolean = true;
    friday: boolean = true;
    saturday: boolean = false;
    sunday: boolean = false;
    holiday: boolean = false;
    constructor() { }
}

