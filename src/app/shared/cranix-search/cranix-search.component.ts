import { Component, Input } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-search',
  templateUrl: './cranix-search.component.html',
  styleUrl: './cranix-search.component.css'
})
export class CranixSearchComponent {
  isModalOpened: boolean = false;
  rowData = []

  @Input({ required: true }) objectType: string
  @Input({ required: true }) selectedItems: any[]
  @Input() context
  @Input() inputData: any[]
  @Input() label: string
  @Input() multiple: boolean
  constructor(
    private objectService: GenericObjectService
  ){
    if(typeof this.inputData == "undefined"){
      this.inputData = this.objectService.allObjects[this.objectType]
    }
    if(typeof this.multiple == "undefined"){
      this.multiple = false;
    }
    if(typeof this.label == "undefined"){
      this.label = "Search " + this.objectType;
    }
    this.rowData = this.inputData
  }

  isSelected(id: number){
    return this.selectedItems.filter(o => o.id == id).length == 1
  }

  select(o: any){
    if(! this.multiple) {
      this.selectedItems = []
    }
    this.selectedItems.push(o)
  }

  deSelect(o: any){
    if(this.multiple) {
      this.selectedItems = []
    } else {
      this.selectedItems = this.selectedItems.filter(obj => obj.id != o.id)
    }
  }
  onQuickFilterChanged() {
    let filter = (<HTMLInputElement>document.getElementById('crxSearchFilter')).value.toLowerCase();
    let tmp = []
    for( let o of this.inputData){
      if(o[this.label].indexOf(filter) > -1 ){
        tmp.push(o)
      }
    }
    this.rowData = tmp;
  }
}
