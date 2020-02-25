export class Hwconf {
	id?: number = 0;
	name: string = "";
	deviceType: string = "";
	description: string = "";
	partitions: Partition[]
	constructor(){}
}
export class Partition {
	id?: number = 0;
	description: string = "";
	format: string = "";
	joinType: string = "";
	name: string = "";
	os: string = "";
	tool: string = "";
	devId?: number = 0;
	lastCloned:number|string = "";
	constructor(){}
}

export class User {
	id?: number = 0;
	surName: string = "";
	givenName: string = "";
	birthDay?: any = new Date();
	password?: string = "";
	uuid?: string = "";
	uid?: string = "";
	role?: string = "";
	classes?: string = "";
	msQuota?: number;
	fsQuota?: number;
	msQuotaUsed?: number;
	fsQuotaUsed?: number;
	mailAliases?: string[] =[];
	constructor(){}
}
export class OldImportsUser{
	role: string = "";
	lang: string = "";
	identifier: string = "";
	test: boolean = false;
	password: string = "";
	mustchange: boolean = false;
	full: boolean = false;
	allClasses: boolean = false;
	cleanClassDirs: boolean = false;
	resetPassword: boolean = false;
	startTime: number = 0;
	result: any;
	constructor(){}
}
export class ImportUser{
	role: string = "";
	lang: string = "";
	identifier: string = "";
	test: boolean = false;
	password: string = "";
	mustchange: boolean = false;
	full: boolean = false;
	allClasses: boolean = false;
	cleanClassDirs: boolean = false;
	resetPassword: boolean = false;
	appendBirthdayToPassword: boolean = false;
	startTime?: any = new Date();
	result?: any = null;
	constructor(){}
}

export class AccessInRooms{
	id?: number = 0;
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
	constructor(){}
}

export class Room {
	id?: number = 0;
	name: string = "";
	places: number = 0;
	rows: number = 0;
	description: string = "";
	netMask: number = 0;
	devices?:any = null;
	users?: User[] = [];
	startIP?: string = "";
	roomType: string = "";
	roomControl: string = "";
	network: string = "";
	hwconfId: number = 0;
	accessInRooms?: AccessInRooms[] = [];
	constructor(){}
}

export class Group {
	id?: number = 0;
	name: string = "";
	description: string = "";
	groupType: string = "";
	constructor() { }
}

export class SoftwareVersions{
	id?: number = 0;
	version: string = "";
	status?: string = "";
	constructor() { }
}

export class Software {
	id?: number = 0;
	description: string = "";
	manually: boolean = false;
	name: string = "";
	weight: number = 0;
	version?: string = "";
	softwareVersions: SoftwareVersions = new SoftwareVersions();
	constructor() { }
}

export class RepoSoftware {
	name: string = "";
	version: string = "";
	constructor(){}
}

export class InstallStateDev {
	softwareName : string = "";
	deviceName : string = "";
	softwareversionId : string = "";
	version : string = "";
	status : string = "";
	manually : boolean = false;
	constructor(){}
}

export class License {
	id?: number = 0;
	softwareId: number = 0;
	licenseType: string = "";
	count: number = 0;
	value: string = "";
	file?: File = null; 
	constructor(){}
}
export class Device {
	id?: number = 0;
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
	constructor(){}
}
export class Printer {
	id?: number = 0;
	name: string = "";
	devId: number = 0;
	mac: string = "";
	roomId: number = 0;
	model: string = "";
	windowsDriver: boolean = false;
	state: string = "";
	acceptingJobs: boolean = false;
	activeJobs: number = 0;
	constructor(){}
}
export class Drivers {
	name: string = "";
	printers: String[] = [];
	constructor(){}
}
export class Installation {
	id?: number = 0;
	description?: string = "";
	name?: string = "";
	categoryType?: string = "";
	deviceIds?: number[] = [];
	roomIds?: number[] = [];
	softwareIds?: number[] = [];
	hwconfIds?: number[]
	constructor(){}
}

export class Permission {
	id?: number = 0;
	acl: string = "";
	allowed: boolean = false;
	userId?: number = 0;
	groupId?: number = 0;
	constructor(){}
}

export class AccessStatus {
	id?: number = 0;
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
	constructor(){}
}

export class Announcenement {
	id?: number = 0;
	abstract: string = "";
	issue: string = "";
	keywords: string = "";
	text: string = "";
	title: string = "";
	validFrom: any = new Date();
	validUntil: any = new Date();
	categories: Category[] = [];
	constructor(){}
}

export class FAQ {
	id?: number = 0;
	abstract: string = "";
	issue: string = "";
	text: string = "";
	title: string = "";
	categories: Category[] = [];
	constructor(){}
}

export class Contact {
	id?: number = 0;
	email: string = "";
	issue: string = "";
	name: string = "";
	phone: string = "";
	title: string = "";
	categories: Category[];
	constructor(){}
}

export class AdHocRoom{
	id?: number = 0;
	name: string = "";
	places: number = 0;
	description: string = "";
	netMask: number = 0;
	startIP?: string = "";
	roomType?: string = "";
	roomControl?: string = "";
	network?: string = "";
	studentsOnly: boolean = false;
	constructor(){}
}

export class SupportTicket{
	email: string = "";
	subject: string = "";
	description: string = "";
	regcode: string = "";
	product: string = "";
	firstname: string = "";
	lastname: string = "";
	company: string = "";
	supporttype?: string = "";
	regcodeValidUntil?: number = 0;
	status?: string = "";
	requestDate?: number = 0;
	ticketno?: number = 0;
	ticketResponseInfo?: string = "";
	constructor(){}
}

export class DNSRecord {
	domainName: string = "";
	recordType: string = "";
	recordName: string = "";
	recordData: string = "";
	constructor(){}
}

export class GuestUsers{
	name: string = "";
	description: string = "";
	count: number = 0;
	password: string = "";
	roomIds?: number[] = [];
	validUntil: any = new Date();
	privateGroup: boolean = false;
	createAdHocRoom: boolean = false;
	roomControl?: string = "";
	constructor(){}
}

export class Category{
	id?: number = 0;
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
	constructor(){}
}

export class DHCP {
	id?: number = 0;
	objectType: string = "";
	objectId: number = 0;
	keyword: string = "";
	value: string = "";
	constructor(){}
}
