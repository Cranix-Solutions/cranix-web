import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrl: './print-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PrintPageComponent {

  printPage: string

  ngOnInit() {
    this.printPage = sessionStorage.getItem('printPage');
    sessionStorage.removeItem('printPage');
  }

  print(){
    window.print();
  }
}