
export interface HWConfig {
	id: number,
	name: string,
	deviceType: string,
	description: string,
	partitions: Partition[]
}
export interface Partition {
	id: number,
	description: string,
	format: string,
	joinType: string,
	name: string,
	os: string,
	tool: string,
	devId?: number,
	lastCloned:number|string,
}

export class User {
	id: number;
	surName: string;
	givenName: string;
	birthDay?: any;
	password?: string;
	uuid?: string;
	uid?: string;
	role?: string;
	classes?: string;
	msQuota?: number;
	fsQuota?: number;
	msQuotaUsed?: number;
	fsQuotaUsed?: number;
	mailAliases?: any;
	constructor(){
		this.id= 0;
		this.surName="";
		this.givenName="";
		this.birthDay= new Date();
		this.password="";
		this.uuid = "";
		this.uid="";
		this.role="";
		this.classes="";
		this.msQuota=0;
		this.msQuotaUsed=0;
		this.fsQuota=0;
		this.fsQuotaUsed=0;
		this.mailAliases="";
	}
}
export interface OldImportsUser{
	role: string,
    lang: string,
    identifier: string,
    test: boolean,
    password: string,
    mustchange: boolean,
    full: boolean,
    allClasses: boolean,
    cleanClassDirs: boolean,
    resetPassword: boolean,
	startTime: number,
    result: any
}
export interface ImportUser{
	role: string,
	lang: string,
	identifier: string,
	test: boolean,
	password: string,
	mustchange: boolean,
	full: boolean,
	allClasses: boolean,
	cleanClassDirs: boolean,
	resetPassword: boolean,
}
export interface Room {
	id: any,
	name: string,
	places: number,
	rows: number,
	description: string,
	netMask: number,
	devices?:any,
	users?: User[],
	startIP?: string,
	roomType: string,
	roomControl: string,
	network: string,
	hwconfId: number,
	accessInRooms?: {
		id?: number,
		accessType: string,
		action?: string,
		roomId: number,
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
}

export class Group {
	id: number;
	name: string;
	description: string;
	groupType: string;
	constructor()
	{
		this.id = 0;
		this.name = "";
		this.description = "";
		this.groupType = "";
	}
}

export interface Software {
	id?: number,
	description: string,
	manually: boolean,
	name: string,
	weight: number,
	version?: string;
	softwareVersions: [
		{
			id?: number,
			version: string,
			status?: string
		}
	]
}

export interface RepoSoftware {
	name: string,
	version: string,
}

export interface InstallStateDev {
	softwareName : string,
	deviceName : string,
	softwareversionId : string,
	version : string,
	status : string,
	manually : boolean,
}

export interface License {
	softwareId: number,
	licenseType: string,
	count: number,
	value: string,
	file?: File, 	
	id: number,

}
export interface Device {

	id?: number,
	name: string,
	place?: number,
	row?: number,
	ip: string,
	mac: string,
	wlanIp?: string,
	wlanMac?: string,
	serial?: string,
	inventary?: string,
	locality?: string,
	hwconfId: number,
	roomId?: any,
	

}
export interface Printer {
	id: number,
	name: string,
	devId: number,
	mac: string,
	roomId: number,
	model: string,
	windowsDriver: boolean,
	state: string,
	acceptingJobs: boolean,
	activeJobs: number,

}
export interface Drivers {
	name: string,
	printers: String[],
}
export interface Installation {
	id: number,
	description?: string,
	name?: string,
	categoryType?: string,
	deviceIds?: number[],
	roomIds?: number[],
	softwareIds?: number[],
	hwconfIds?: number[]
}

export interface Permission {
	id?: number,
	acl: string,
	allowed: boolean,
	userId?: number,
	groupId?: number,
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

export interface Announcenement {
	id: number,
	abstract_: string,
    issue: string,
    keywords: string,
    text: string,
    title: string,
    validFrom: number,
	validUntil: number,
	categories: InfoCategory[],
}

export interface FAQ {
	id: number,
    abstract_: string,
    issue: string,
    text: string,
	title: string,
	categories: InfoCategory[],

}

export interface Contact {
	id: number,
    email: string,
    issue: string,
    name: string,
    phone: string,
	title: string,
	categories: InfoCategory[]
}

export interface InfoCategory {
    id: number,
    description: string,
    name: string,
    categoryType: string,
    validFrom: number,
    validUntil: number,
    ownerId: number,
    deviceIds: number[],
    hwConfIds: number[],
    roomIds: number[],
    userIds: number[],
    groupIds: number[],
    softwareIds: number[],
    announcementIds: number[],
    contactIds: number[],
    faqIds: number[],
    studentsOnly: boolean,
    hwconfIds: number[],
	faqids: number[]
	
}


export interface AdHocRoom{
	id: any,
	name: string,
	places: number,
	description: string,
	netMask: number,
	startIP?: string,
	roomType?: string,
	roomControl?: string,
	network?: string,
	studentsOnly: boolean
}

export interface SupportTicket{
	email: string,
	subject: string,
	description: string,
	regcode: string,
	product: string,
	firstname: string,
	lastname: string,
	company: string,
	supporttype?: string, //Error | Features
	regcodeValidUntil?: number,
	status?: string,
	requestDate?: number,
	ticketno?: number,
	ticketResponseInfo?: string
}

export interface DNSRecord {
	domainName: string,
    recordType: string,
    recordName: string,
    recordData: string
}

export class UserC {

	constructor(

	public id: any,
	public surName: string,
	public givenName: string,
	public birthDay?: number,
	public password?: string,
	public uid?: string,
	public role?: string,
	public msQuota?: number,
	public fsQuota?: number,
	public msQuotaUsed?: number,
	public fsQuotaUsed?: number,
	){}
}

export interface GuestUsers{
	name: string,
	description: string,
	count: number,
	password: string,
	roomIds?: number[],
	validUntil: number,
	privateGroup: boolean,
	createAdHocRoom: boolean,
	roomControl?: string,
}

export interface Category{
	
		id?: number;	
		description: string,
		name: string,
		categoryType: string,
		validFrom?: number,
		validUntil: number,
		ownerId?: number,
		deviceIds?: number[],
		hwConfIds?: number[],
		roomIds?: number[],
		userIds?: number[],
		groupIds?: number[],
		softwareIds?: number[],
		announcementIds?: number[],
		contactIds?: number[],
		faqIds?: number[],
		studentsOnly?: true,
		publicAccess?: true,
		hwconfIds?: number[],
		faqids?: number[]	
}

export interface DHCP {
	id: number,
	objectType: string,
	objectId: number,
	keyword: string,
	value: string
  }
