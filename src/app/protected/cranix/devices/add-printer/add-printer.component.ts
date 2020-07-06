import { Component, OnInit } from '@angular/core';
//own stuff
import { PrintersService } from 'src/app/services/printers.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Printer, Room } from 'src/app/shared/models/data-model';
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
    this.initValues(1);
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

    this.submitted = true;
    let formData: FormData = new FormData();
    if (this.driverFile) {
      formData.append('file', this.driverFile, this.driverFile.name);
    } else if (printer.model) {
      formData.append('model', printer.model);
    } else {
      this.objectService.errorMessage(
        this.languageS.trans('You have to set either the model of the printer or upload a ppd driver file.')
      );
      return;
    }
    formData.append('ip', printer.ip);
    formData.append('name', printer.name);
    formData.append('mac', printer.mac);
    formData.append('roomId', printer.roomId.toString());
    formData.append('windowsDriver', "true");
    let subs = this.printersService.add(formData).subscribe(
      (val) => {
        this.objectService.getAllObject('printer');
        this.objectService.getAllObject('device');
        if (val.code == "OK") {
          this.objectService.okMessage(this.languageS.transResponse(val));
          this.modalCtrl.dismiss();
        } else {
          this.objectService.errorMessage(this.languageS.transResponse(val));
          this.submitted=false;
        }
      },
      (err) => {
        this.objectService.errorMessage("ServerError" + err);
        this.submitted=false;
        this.authService.log(err);
      },
      () => { subs.unsubscribe() }
    )
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
