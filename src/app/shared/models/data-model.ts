
export class Hwconf {
	id?: number = 0;
	name: string = "";
	deviceType: string = "";
	description: string = "";
	partitions?: Partition[]
	constructor() { }
}

export class Partition {
	id?: number;
	name: string = "";
	description: string = "";
	os: string = "";
	format: string = "";
	joinType: string = "";
	tool: string = "";
	lastCloned: number | string = "";
	constructor() { }
}

export class User {
	id?: number;
	uid?: string = "";
	uuid?: string = "";
	surName: string = "";
	givenName: string = "";
	birthDay?: any = new Date();
	password?: string = "";
	role?: string = "";
	classes?: string = "";
	msQuota?: number = 0;
	fsQuota?: number = 0;
	msQuotaUsed?: number = 0;
	fsQuotaUsed?: number = 0;
	mailAliases?: string[] = [];
	constructor() { }
}
export class UsersImport {
	startTime: string;
	role: string = "";
	lang: string = "";
	identifier: string = "";
	test: boolean = true;
	password: string = "";
	mustChange: boolean = false;
	full: boolean = false;
	allClasses: boolean = false;
	cleanClassDirs: boolean = false;
	resetPassword: boolean = false;
	appendBirthdayToPassword: boolean = false;
	result?: any = null;
	importFile: any;
	constructor() { }
}

export class AccessInRooms {
	id?: number;
	accessType: string = "";
	action?: string = "";
	roomId: number = 0;
	monday?: boolean = false;
	tuesday?: boolean = false;
	wednesday?: boolean = false;
	thursday?: boolean = false;
	friday?: boolean = false;
	saturday?: boolean = false;
	sunday?: boolean = false;
	holiday?: boolean = false;
	direct: boolean = false;
	login: boolean = false;
	portal: boolean = false;
	printing: boolean = false;
	proxy: boolean = false;
	pointInTime?: string = "";
	constructor() { }
}

export class Room {
	id?: number;
	name: string = "";
	description: string = "";
	hwconfId: number = 0;
	netMask?: number = 0;
	devCount?: number = 0;
	devices?: any;
	users?: User[];
	startIP?: string = "";
	roomType: string = "";
	roomControl: string = "";
	network: string;
	places: number = 0;
	rows: number = 0;
	accessInRooms?: AccessInRooms[] = [];
	constructor() { }
}

export class Group {
	id?: number;
	name: string = "";
	description: string = "";
	groupType: string = "";
	constructor() { }
}

export class Package {
	name: string = "";
	version: string = "";
	constructor() { }
}
export class SoftwareVersions {
	id?: number;
	version: string = "";
	status?: string = "";
	constructor() { }
}

export class Software {
	id?: number;
	name: string = "";
	description: string = "";
	weight: number = 0;
	version?: string = "";
	manually: boolean;
	sourceAvailable: boolean;
	softwareVersions: any[];
	softwareFullNames: any[];
	constructor() { }
}

export class SoftwareStatus {
	id: number = 0;
	status: string = "";
	softwareversionId?: number;
	deviceId?: number;
	roomName: string = "";
	deviceName: string = "";
	softwareName: string = "";
	manually: boolean;
	softwareId: number;
	version: string;
	constructor() { }
}

export class RepoSoftware {
	name: string = "";
	version: string = "";
	constructor() { }
}

export class InstallStateDev {
	softwareName: string = "";
	deviceName: string = "";
	softwareversionId: string = "";
	version: string = "";
	status: string = "";
	manually: boolean = false;
	constructor() { }
}

export class License {
	id?: number;
	softwareId: number = 0;
	licenseType: string = "";
	count: number = 0;
	value: string = "";
	file?: File = null;
	constructor() { }
}
export class Device {
	id?: number;
	name: string = "";
	place?: number = 0;
	row?: number = 0;
	ip: string = "";
	mac: string = "";
	wlanIp?: string = "";
	wlanMac?: string = "";
	serial?: string = "";
	inventary?: string = "";
	locality?: string = "";
	hwconfId: number = 0;
	roomId?: any = null;
	screenShot? = "";
	loggedInId? = "";
	constructor() { }
}
export class Printer {
	id?: number;
	name: string = "";
	ip: string = "";
	deviceName: string = "";
	manufacturer: string = "";
	model: string = "";
	mac: string = "";
	roomId: number = 0;
	windowsDriver: boolean = false;
	state: string = "";
	acceptingJobs: boolean = false;
	activeJobs: number = 0;
	inventary: string = "";
	serial: string ="";
	driverFile: any = "";
	constructor() { }
}
export class Drivers {
	name: string = "";
	printers: String[] = [];
	constructor() { }
}
export class Installation {
	id?: number;
	name?: string = "";
	description?: string = "";
	categoryType?: string = "";
	deviceIds?: number[] = [];
	roomIds?: number[] = [];
	softwareIds?: number[] = [];
	hwonfIds?: number[]
	constructor() { }
}

export class Permission {
	id?: number;
	acl: string = "";
	allowed: boolean = false;
	userId?: number = 0;
	groupId?: number = 0;
	constructor() { }
}

export class AccessStatus {
	id?: number;
	accessType?: string = "";
	action?: string = "";
	roomId: any = null;
	monday?: boolean = false;
	tuesday?: boolean = false;
	wednesday?: boolean = false;
	thursday?: boolean = false;
	friday?: boolean = false;
	saturday?: boolean = false;
	sunday?: boolean = false;
	holiday?: boolean = false;
	direct: boolean = false;
	login: boolean = false;
	portal: boolean = false;
	printing: boolean = false;
	proxy: boolean = false;
	pointInTime?: string = "";
	constructor() { }
}

export class Announcenement {
	id?: number;
	abstract: string = "";
	issue: string = "";
	keywords: string = "";
	text: string = "";
	title: string = "";
	validFrom: any = new Date();
	validUntil: any = new Date();
	categories: Category[] = [];
	constructor() { }
}

export class FAQ {
	id?: number;
	abstract: string = "";
	issue: string = "";
	text: string = "";
	title: string = "";
	categories: Category[] = [];
	constructor() { }
}

export class Contact {
	id?: number;
	email: string = "";
	issue: string = "";
	name: string = "";
	phone: string = "";
	title: string = "";
	categories: Category[];
	constructor() { }
}

export class AdHocRoom extends Room {
	devicesProUser?: number = 1;
	devCount: number = 0;
	studentsOnly: boolean = false;
	groupIds: number[]=[];
	userIds?: number[] = [];
	users?: User[] = [];
	groups?: Group[] = [];
}

export class SupportTicket {
	firstname: string = "";
	lastname: string = "";
	email: string = "";
	supporttype: string = "Error";
	subject: string = "";
	description: string = "";
	text?: string = "";
	regcode: string = "";
	product: string = "";
	company: string = "";
	regcodeValidUntil?: number = 0;
	status?: string = "";
	requestDate?: number = 0;
	ticketno?: number = 0;
	ticketResponseInfo?: string = "";
	constructor() { }
}

export class DNSRecord {
	domainName: string = "";
	recordType: string = "";
	recordName: string = "";
	recordData: string = "";
	constructor() { }
}

export class GuestUsers {
	name: string = "";
	description: string = "";
	count: number = 0;
	password: string = "";
	roomIds?: number[] = [];
	validUntil: any = new Date();
	privateGroup: boolean = false;
	createAdHocRoom: boolean = false;
	roomControl?: string = "";
	constructor() { }
}

export class Category {
	id?: number;
	description: string = "";
	name: string = "";
	categoryType: string = "";
	validFrom?: any = new Date();
	validUntil: any = new Date();
	ownerId?: number = 0;
	deviceIds?: number[] = [];
	roomIds?: number[] = [];
	userIds?: number[] = [];
	groupIds?: number[] = [];
	softwareIds?: number[] = [];
	announcementIds?: number[] = [];
	contactIds?: number[] = [];
	faqIds?: number[] = [];
	studentsOnly?: boolean = false;
	publicAccess?: boolean = false;
	hwconfIds?: number[] = [];
	faqids?: number[];
	constructor() { }
}

export class DHCP {
	id?: number;
	objectType: string = "";
	objectId: number = 0;
	keyword: string = "";
	value: string = "";
	constructor() { }
}

export class SystemConfig {
	path: string = "";
	readOnly: string = "";
	type: string = "string";
	key: string = "";
	value: string = "";
	help: string = "";
	constructor() { }
}

export class EduRoom{
	id?: number;
	name: string = "";
	description: string = "";
	hwconfId: number = 0;
	netMask?: number = 0;
	devCount?: number = 0;
	devices?: any;
	users?: User[];
	startIP?: string = "";
	roomType: string = "";
	roomControl: string = "";
	network: string;
	places: number = 0;
	rows: number = 0;
	accessInRooms?: AccessInRooms;
	constructor() { }
}

export interface SmartRoom{
    id?: number, 
    name: string, 
    description: string, 
    validFrom?: number, 
    validUntil?: number,
    ownerId?: number, 
    deviceIds?: number[],
    hwConfIds?: number [],
    roomIds?: number [],
    userIds?: number [],
    groupIds?: number [],
    announcementIds?: number [],
  }

export interface SmartRoomStatus{
    userId: number, 
    deviceId: number
}


export class PositivList {
	id?: number = 0;
    name: string = "";
    description: string = "";
    subject: string  = "";
    domains: string = "";
}

export interface AccessStatus {
	id?: number,
	accessType?: string,
	action?: string,
	roomId: any,
	monday?: boolean,
	tuesday?: boolean,
	wednesday?: boolean,
	thursday?: boolean,
	friday?: boolean,
	saturday?: boolean,
	sunday?: boolean,
	holiday?: boolean,
	direct: boolean,
	login: boolean,
	portal: boolean,
	printing: boolean,
	proxy: boolean,
	pointInTime?: string
}