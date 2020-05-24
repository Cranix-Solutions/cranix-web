import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  editPrinter;
  noPrinter: Printer = new Printer;
  allDefaultPrinters: Printer[] = [this.noPrinter];
  allPrinters: Printer[] = [];
  room: Room;
  printers = {
    defaultPrinter: 0,
    availablePrinters: []
  }

  constructor(
    private roomService: RoomsService,
    private languageS: LanguageService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    private toastController: ToastController
  ) {
    this.room = <Room>this.objectService.selectedObject;
    this.noPrinter.id=0;
    this.noPrinter.name= languageS.trans("No default  printer");
  }

  ngOnInit() {
    this.objectService.getObjects('printer').subscribe(
      (obj) => {
        this.allPrinters = obj;
        this.allDefaultPrinters = this.allDefaultPrinters.concat(obj);
      });
      this.readPrinters();
      console.log("printers");
      console.log(this.printers);
      this.editPrinter = this.formBuilder.group(this.printers);
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }

  readPrinters() {
    let subM = this.roomService.getAvailablePrinter(this.room.id).subscribe(
      (val) => {
        for (let printer of val) {
          this.printers.availablePrinters.push(printer.id);
        }
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
    let subNM = this.roomService.getDefaultPrinter(this.room.id).subscribe(
      (val) => {
        if (val) {
          this.printers.defaultPrinter = val.id;
        }
      },
      (err) => { console.log(err) },
      () => { subNM.unsubscribe() })
  }

  compareFn(a: number, b): boolean {
    console.log(a,b);
    return a == b;
  }
  onSubmit(form) {
    this.editPrinter.disable();
    let serverResponse: ServerResponse;
    let printers = {
      defaultPrinter: [form.defaultPrinter],
      availablePrinters: form.availablePrinters
    };
    console.log(form);
    console.log(printers)
    let sub = this.roomService.setPrinters(this.room.id, printers).subscribe(
      async (val) => {
        serverResponse = val;
        if (serverResponse.code == "OK") {
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("Success:"),
            message: this.languageS.trans(serverResponse.value),
            color: "success",
            duration: 5000
          });
          (await toast).present();
        } else {
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("An Error was accoured:"),
            message: serverResponse.value,
            color: "warning",
            duration: 6000
          });
          (await toast).present();
        }
      },
      async (error) => {
        const toast = this.toastController.create({
          position: "middle",
          header: this.languageS.trans("An Error was accoured:"),
          message: error,
          color: "warning",
          duration: 6000
        });
        (await toast).present();
        console.log(error);
      },
      () => {
        sub.unsubscribe();
      }
    )
    this.editPrinter.enable();
  }
}
