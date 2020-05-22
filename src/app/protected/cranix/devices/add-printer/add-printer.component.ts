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
  printer: Printer;

  constructor(
    public authService: AuthenticationService,
    public printerService: PrintersService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public objectService: GenericObjectService,
    public roomService: RoomsService
  ) { }

  ngOnInit() {
    this.room = this.navParams.get('room');
    if (this.room) {
      this.initValues(this.room.id);
    } else {
      this.initValues(null);
    }
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  initValues(id: number) {
    this.printer = new Printer();
    if (id) {
      console.log(id);
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
        (err) => { console.log(err) },
        () => { sub.unsubscribe() }
      )
      this.room = this.objectService.getObjectById('room', id);
      console.log(this.room);
      this.printer.hwconfId = this.room.hwconfId;
      this.printer.roomId = this.room.id;
    }
    if( this.authService.session.mac ) {
      this.printer.mac = this.authService.session.mac;
    }
  }
  onSubmit(printer: Printer) {
    let printers: Printer[] = [];
    printers.push(printer);
    console.log(printers);
    let subs = this.roomService.addPrinter(printers, this.room.id).subscribe(
      (val) => {
        if (val.code == "OK") {
          this.objectService.getAllObject('printers');
          this.objectService.okMessage(this.languageS.transResponse(val));
          this.modalCtrl.dismiss();
        } else {
          this.objectService.errorMessage(this.languageS.transResponse(val));
        }
      },
      (err) => {
         this.objectService.errorMessage("ServerError" + err);
         console.log(err);
         },
      () => { subs.unsubscribe() }
    )
  }
  ipChanged(ev) {
    this.printer.name = this.printerNames[ev];
  }
  roomChanged(ev) {
    this.initValues(parseInt(ev));
  }
}
