import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Device } from 'src/app/shared/models/data-model'


@Component({
  selector: 'cranix-show-screen',
  templateUrl: './show-screen.component.html',
  styleUrls: ['./show-screen.component.scss'],
})
export class ShowScreenComponent implements OnInit {

  screenShot: string ="";
  @Input() device: Device;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
  }
}
