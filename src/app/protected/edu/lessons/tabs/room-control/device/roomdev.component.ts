import { Component, OnInit, Input } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit {

  @Input() index: number; 
  @Input() device: Device;
  @Input() row: number;
  @Input() place: number;

  screenShot ; 

  constructor() { }

  ngOnInit() {
    if(this.device){
    this.getScreen();
    }
  }

  getScreen(){
     this.screenShot= "data:image/jpg;base64,"+this.device.screenShot;
      console.log("screen is: ", this.screenShot);
    }

}
