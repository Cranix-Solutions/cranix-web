import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Printer, Room } from 'src/app/shared/models/data-model'
import { ServerResponse } from 'src/app/shared/models/server-models';

@Component({
  selector: 'cranix-room-printers',
  templateUrl: './room-printers.page.html',
  styleUrls: ['./room-printers.page.scss'],
})
export class RoomPrintersPage implements OnInit {
  noPrinter: Printer = new Printer;
  allDefaultPrinters: Printer[] = [this.noPrinter];
  allPrinters: Printer[] = [];
  room: Room;
  printers = {
    defaultPrinter: null,
    availablePrinters: []
  }

  constructor(
    private roomService: RoomsService,
    private languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService
  ) {

  }

  ngOnInit() {
    this.room = <Room>this.objectService.selectedObject;
    this.noPrinter.id = 0;
    this.noPrinter.name = this.languageS.trans("No default  printer");
    this.printers.defaultPrinter = this.noPrinter;
    this.objectService.getObjects('printer').subscribe(
      (obj) => {
        this.allPrinters = obj;
        this.allDefaultPrinters = this.allDefaultPrinters.concat(obj);
        this.roomService.getAvailablePrinter(this.room.id).subscribe(
          (val) => {
            for (let printer of val) {
              this.printers.availablePrinters.push(printer);
            }
            this.roomService.getDefaultPrinter(this.room.id).subscribe(
              (val) => {
                if (val) {
                  this.printers.defaultPrinter = val;
                }
                console.log(this.printers);
              }
            )
          }
        )
      }
    )
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  compareFn(o1: Printer, o2: Printer | Printer[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }
    if (Array.isArray(o2)) {
      return o2.some((u: Printer) => u.id === o1.id);
    }
    return o1.id === o2.id;
  }

  setPrinters() {
    console.log(this.printers)
    let printers = {
      defaultPrinter: [this.printers.defaultPrinter.id],
      availablePrinters: this.printers.availablePrinters.map(a => a.id)
    };
    let sub = this.roomService.setPrinters(this.room.id, printers).subscribe(
      async (val) => {
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss();
      },
      async (error) => {
        this.objectService.errorMessage(error);
      },
      () => {
        sub.unsubscribe();
      }
    )
  }
}
