import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SecurityService } from 'src/app/services/security-service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SafeSearch } from 'src/app/shared/models/secutiry-model';

@Component({
  selector: 'cranix-unbound',
  templateUrl: './unbound.component.html',
  styleUrls: ['./unbound.component.scss'],
})
export class UnboundComponent implements OnInit {

  badList: string[] = []
  whiteList: string[] = []
  cephalixList: string[] = []
  newDomain: string = ""
  newDomain1: string = ""
  categories: any[];
  activeUnboundLists: string[] = [];
  saving: boolean = false;
  segment: string = "categories";
  safeSearchList: SafeSearch[] = [];

  constructor(
    public authService: AuthenticationService,
    private languageS: LanguageService,
    public objectService: GenericObjectService,
    public securityService: SecurityService
  ) { }

  ngOnInit() {
    this.securityService.unboundChanged = false;
    this.readLists('bad').then(val => { this.badList = val.sort() });
    this.readLists('good').then(val => { this.whiteList = val.sort() });
    this.readLists('cephalix').then(val => { this.cephalixList = val.sort() });
    this.getProxyCategories().then(val => {
      this.categories = val
      this.categories.sort((a, b) => (a.desc > b.desc) ? 1 : (b.desc > a.desc) ? -1 : 0)
    })
    this.securityService.getActiveUnboundLists().subscribe(
      (val) => { if (val) { this.activeUnboundLists = val.split(" ") } }
    )
    this.securityService.getUnboundSafeSearch().subscribe(
      (val) => { this.safeSearchList = val }
    )
  }


  segmentChanged(event) {
    this.segment = event.detail.value;
    this.newDomain = "";
  }
  getProxyCategories(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.securityService.getProxyCategories().subscribe(
        (val) => { resolve(val) }
      )
    });
  }
  readLists(listName): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.securityService.getProxyCustom(listName).subscribe(
        (val) => { resolve(val) }
      )
    });
  }

  deleteDomain(index) {
    this.badList.splice(index, 1)
    this.securityService.unboundChanged = true;
  }
  addNewDomain() {
    this.badList.push(this.newDomain)
    this.badList.sort()
    this.securityService.unboundChanged = true;
    this.newDomain = "";
  }

  deleteDomain1(index) {
    this.whiteList.splice(index, 1)
    this.securityService.unboundChanged = true;
  }
  addNewDomain1() {
    this.whiteList.push(this.newDomain1)
    this.whiteList.sort()
    this.securityService.unboundChanged = true;
    this.newDomain1 = "";
  }
  writeConfig() {
    console.log(this.safeSearchList)
    this.objectService.requestSent();
    this.saving = true;
    if (this.authService.session.name == 'cephalix') {
      this.securityService.setProxyCustom('cephalix', this.cephalixList).subscribe();
    }
    let sub = this.securityService.setProxyCustom('bad', this.badList).subscribe({
      next: (val) => {
        this.securityService.setProxyCustom('good', this.whiteList).subscribe({
          next: (val1) => {
            this.securityService.setActiveUnboundLists(this.activeUnboundLists.join(" ")).subscribe({
              next: (val2) => {
                this.securityService.setUnboundSafeSearch(this.safeSearchList).subscribe({
                  next: (val3) => {
                    this.securityService.resetUnbound().subscribe({
                      next: (val4) => {
                        this.objectService.responseMessage(val4)
                        this.securityService.unboundChanged = false;
                        this.saving = false;
                      },
                      error: (err4) => { 
                        this.objectService.errorMessage(err4)
                        this.saving = false
                      }
                    })
                  },
                  error: (err3) => { 
                    this.objectService.errorMessage(err3)
                    this.saving = false
                   }
                })
              },
              error: (err2) => { 
                this.objectService.errorMessage(err2)
                this.saving = false
              }
            })
          },
          error: (err1) => {
            this.objectService.errorMessage(err1)
            this.saving = false
          }
        })
      },
      error: (err) => {
        this.objectService.errorMessage(err)
        this.saving = false
      }
    })
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
