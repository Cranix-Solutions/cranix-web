import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SecurityService } from 'src/app/services/security-service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'cranix-unbound',
  templateUrl: './unbound.component.html',
  styleUrls: ['./unbound.component.scss'],
})
export class UnboundComponent implements OnInit {

  badList: string[] = []
  newDomain: string = ""
  categories: any[];
  activeUnboundLists: string[] = [];

  constructor(
    private languageS: LanguageService,
    public objectService: GenericObjectService,
    public securityService: SecurityService
  ) { }

  ngOnInit() {
    this.securityService.unboudChanged = false;
    this.readLists('bad').then(val => { this.badList = val.sort() });
    this.getProxyCategories().then(val => {
      this.categories = val
      this.categories.sort((a, b) => (a.desc > b.desc) ? 1 : (b.desc > a.desc) ? -1 : 0)
    })
    this.securityService.getActiveUnboundLists().subscribe(
      (val) => { if( val ) {this.activeUnboundLists = val.split(" ") }},
      (err) => { console.log(err) }
    )
  }

  getProxyCategories(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let sub1 = this.securityService.getProxyCategories().subscribe(
        (val) => { resolve(val) },
        (err) => { console.log(err) },
        () => { sub1.unsubscribe() }
      )
    });
  }
  readLists(listName): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let sub1 = this.securityService.getProxyCustom(listName).subscribe(
        (val) => { resolve(val) },
        (err) => { console.log(err) },
        () => { sub1.unsubscribe() }
      )
    });
  }

  deleteDomain(index) {
    this.badList.splice(index, 1)
    this.securityService.unboudChanged = true;
  }
  addNewDomain() {
    this.badList.push(this.newDomain)
    this.badList.sort()
    this.securityService.unboudChanged = true;
    this.newDomain = "";
  }

  writeConfig() {
    this.objectService.requestSent();
    let sub = this.securityService.setProxyCustom('bad', this.badList).subscribe(
      (val) => {
        this.securityService.setActiveUnboundLists(this.activeUnboundLists.join(" ")).subscribe(
          (val2) => {
            this.securityService.resetUnbound().subscribe(
              (val3) => {
                this.objectService.responseMessage(val3)
                this.securityService.unboudChanged = false;
              },
              (err3) => { console.log(err3) }
            )
          },
          (err2) => { console.log(err2) }
        )
      },
      (err) => { this.objectService.errorMessage(this.languageS.trans("An error was accoured")); },
      () => { sub.unsubscribe() }
    )
  }
  togleCategory(cat) {
    let index = this.activeUnboundLists.indexOf(cat);
    if (index == -1) {
      this.activeUnboundLists.push(cat)
    } else {
      this.activeUnboundLists.splice(index, 1)
    }
    console.log(this.activeUnboundLists)
  }
}
