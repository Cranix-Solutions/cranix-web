import { Component, OnInit } from '@angular/core';
//own stuff
import { PrintersService } from 'src/app/services/printers.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Printer, Room, Device } from 'src/app/shared/models/data-model';
import { ModalController, NavParams } from '@ionic/angular';
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
  models = {};
  manufacturers: string[] = [];
  submitted = false;
  printerDevices: Device[] = [];
  action = "";
  originalModel = "";

  constructor(
    public authService: AuthenticationService,
    public printersService: PrintersService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public objectService: GenericObjectService,
    public roomService: RoomsService
  ) { }

  ngOnInit() {
    let subs = this.printersService.getDrivers().subscribe(
      (val) => {
        this.models = val;
        this.manufacturers = Object.keys(this.models).sort();
      },
      (err) => { this.authService.log(err) },
      () => { subs.unsubscribe() }
    )
    this.action = this.navParams.get('action')
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
        this.printer = this.navParams.get('object');
        this.originalModel = this.printer.model
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
    }
    if (this.authService.session.mac) {
      this.printer.mac = this.authService.session.mac;
    }
  }

  onSubmit(printer: Printer) {
    this.objectService.requestSent();
    this.submitted = true;
    let formData: FormData = new FormData();
    if (this.driverFile) {
      formData.append('file', this.driverFile, this.driverFile.name);
    } else if (printer.model) {
      formData.append('model', printer.model);
    } else if( this.action != 'modify' ) {
      this.objectService.errorMessage(
        this.languageS.trans('You have to set either the model of the printer or upload a ppd driver file.')
      );
      return;
    }
    formData.append('name', printer.name);
    switch (this.action) {
      case 'add': {
        formData.append('ip', printer.ip);
        formData.append('mac', printer.mac);
        formData.append('roomId', printer.roomId.toString());
        formData.append('windowsDriver', "true");
        let subs = this.printersService.add(formData).subscribe(
          (val) => {
            this.objectService.responseMessage(val);
            if (val.code == "OK") {
              this.objectService.getAllObject('device');
              this.objectService.getAllObject('printer');
              this.modalCtrl.dismiss();
            }
            this.submitted = false;
          },
          (err) => {
            this.objectService.errorMessage("ServerError" + err);
            this.authService.log(err);
            this.submitted = false;
          },
          () => { subs.unsubscribe() }
        )
        break
      }
      case 'queue': {
        formData.append('deviceId', printer.deviceId.toString());
        formData.append('windowsDriver', "true");
        let subs = this.printersService.add(formData).subscribe(
          (val) => {
            this.objectService.responseMessage(val);
            if (val.code == "OK") {
              this.objectService.getAllObject('printer');
              this.modalCtrl.dismiss();
            }
            this.submitted = false;
          },
          (err) => {
            this.objectService.errorMessage("ServerError" + err);
            this.authService.log(err);
            this.submitted = false;
          },
          () => { subs.unsubscribe() }
        )
        break
      }
      case 'modify': {
        if( formData.has('file') || this.originalModel != printer.model ) {
          let subs3 = this.printersService.setDrive(this.printer.id,formData).subscribe(
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
              console.log(err)},
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
  handleFileInput(files: FileList) {
    this.driverFile = files.item(0);
  }
  manufacturerChanged(ev) {
    this.printer.model = "";
  }
}
