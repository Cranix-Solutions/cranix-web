import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EductaionService } from 'src/app/services/education.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cranix-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.scss'],
})
export class SelectRoomComponent implements AfterViewInit, OnInit {

  @ViewChild('roomSelect') select: IonicSelectableComponent;
  constructor(
    public eduS: EductaionService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.select.open();
  }
  closeMe(){
    console.log("selected")
    this.modalCtrl.dismiss('OK')
  }
}
