import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrl: './print-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PrintPageComponent {

  printPage: string
  title: string
  instituteName: string
  ngOnInit() {
    this.instituteName = sessionStorage.getItem('instituteName')
    this.printPage = sessionStorage.getItem('printPage');
    this.title = sessionStorage.getItem('title');
    sessionStorage.removeItem('printPage');
    sessionStorage.removeItem('title');
    sessionStorage.removeItem('instituteName');
  }

  print(){
    window.print();
  }
}