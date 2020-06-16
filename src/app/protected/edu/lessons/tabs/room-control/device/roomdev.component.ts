import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit {

  @Input() index: number; 

  constructor() { }

  ngOnInit() {}

}
