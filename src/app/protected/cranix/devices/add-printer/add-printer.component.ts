import { Component, Input, OnInit } from '@angular/core';
//own stuff
import { PrintersService } from 'src/app/services/printers.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Printer, Room, Device } from 'src/app/shared/models/data-model';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-add-printer',
  templateUrl: './add-printer.component.html',
  styleUrls: ['./add-printer.component.scss'],
})
export class AddPrinterComponent implements OnInit {

  ipAdresses: string[] = [];
  printerNames = {};
  room: Room;
  name: string = "";
  printer: Printer = new Printer();
  driverFile;
  model  = { key: "" , label: "" };
  models = {};
  manufacturer = { key: "" , label: "" };
  manufacturers = [];
  submitted = false;
  printerDevices: Device[] = [];
  originalModel = "";
  originalMac   = "";

  @Input() action;
  @Input() object: Printer;
  constructor(
    public authService: AuthenticationService,
    public printersService: PrintersService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public roomService: RoomsService
  ) { }

  ngOnInit() {
    let subs = this.printersService.getDrivers().subscribe(
      (val) => {
        for( let man of Object.keys(val).sort() ) {
          this.manufacturers.push( { key: man, label: man } )
          this.models[man] = []
          for( let mod of val[man] ) {
            this.models[man].push({ key: mod, label: mod })
          }
        }
        //this.models = val;
        //this.manufacturers = Object.keys(this.models).sort();
      },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() }
    )
    switch (this.action) {
      case 'queue':
        this.printersService.getPrinterDevices().subscribe(
          (val) => {
            this.printerDevices = val
            this.printerDevices.sort(this.objectService.sortByName);
          },
          (err) => { console.log(err) }
        )
        break;
      case 'add':
        this.initValues;
        break;
      case 'modify':
        this.printer = this.object;
        this.originalModel = this.printer.model
        this.originalMac   = this.printer.mac
        this.model = { key: this.originalModel, label: this.originalModel }
    }
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  initValues(id: number) {
    this.printer = new Printer();
    if (id) {
      this.authService.log(id);
      this.ipAdresses = [];
      this.printerNames = {};
      let sub = this.roomService.getAvailiableIPs(id).subscribe(
        (val) => {
          for (let a of val) {
            let b = a.split(" ");
            this.ipAdresses.push(b[0]);
            this.printerNames[b[0]] = b[1];
          }
        },
        (err) => { this.authService.log(err) },
        () => { sub.unsubscribe() }
      )
      this.room = this.objectService.getObjectById('room', id);
      this.authService.log(this.room);
      this.printer.roomId = this.room.id;
      this.model = { key: this.printer.model, label: this.printer.model }
    }
  }

  setModel(ev){
    this.printer.model = ev.item.key
  }
  onSubmit() {
    console.log(this.printer)
    this.objectService.requestSent();
    this.submitted = true;
    let formData: FormData = new FormData();
    if (this.driverFile) {
      formData.append('file', this.driverFile, this.driverFile.name);
    } else if (this.printer.model) {
      formData.append('model', this.printer.model);
    } else if (this.action != 'modify') {
      this.objectService.errorMessage(
        this.languageS.trans('You have to set either the model of the printer or upload a ppd driver file.')
      );
      return;
    }
    formData.append('name', this.printer.name);
    switch (this.action) {
      case 'add': {
        formData.append('ip', this.printer.ip);
        formData.append('mac', this.printer.mac);
        formData.append('roomId', this.printer.roomId.toString());
        formData.append('windowsDriver', "true");
        let subs = this.printersService.add(formData).subscribe(
          (val) => {
            this.objectService.responseMessage(val);
            if (val.code == "OK") {
              this.modalCtrl.dismiss();
            }
            this.submitted = false;
          },
          (err) => {
            this.objectService.errorMessage("ServerError" + err);
            this.authService.log(err);
            this.submitted = false;
          },
          () => {
            subs.unsubscribe();
            this.objectService.getAllObject('device');
            this.objectService.getAllObject('printer');
          }
        )
        break
      }
      case 'queue': {
        formData.append('deviceId', this.printer.deviceId.toString());
        formData.append('windowsDriver', "true");
        let subs = this.printersService.addQueue(formData).subscribe(
          (val) => {
            this.objectService.responseMessage(val);
            if (val.code == "OK") {
              this.modalCtrl.dismiss();
            }
            this.submitted = false;
          },
          (err) => {
            this.objectService.errorMessage("ServerError" + err);
            this.authService.log(err);
            this.submitted = false;
          },
          () => {
            subs.unsubscribe();
            this.objectService.getAllObject('printer');
          }
        )
        break
      }
      case 'modify': {
        if (formData.has('file') || this.originalModel != this.printer.model || this.originalMac != this.printer.mac) {
          let subs3 = this.printersService.setDriver(this.printer.id, formData).subscribe(
            (val) => {
              this.objectService.responseMessage(val);
              if (val.code == "OK") {
                this.objectService.getAllObject('printer');
                this.modalCtrl.dismiss();
              }
              this.submitted = false;
            },
            (err) => {
              this.submitted = false;
              console.log(err)
            },
            () => { subs3.unsubscribe() }
          );
        }
        break
      }
    }
  }

  roomChanged(ev) {
    this.initValues(parseInt(ev));
  }
  handleFileInput(ev) {
    this.driverFile = ev.target.files.item(0);
  }
  manufacturerChanged(ev) {
    this.printer.model = "";
  }
}
