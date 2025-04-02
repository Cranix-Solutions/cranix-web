import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cranix-search',
  templateUrl: './cranix-search.component.html',
  styleUrl: './cranix-search.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CranixSearchComponent),
    multi: true
  }]
})
export class CranixSearchComponent implements ControlValueAccessor, OnInit {
  isCranixSearchModalOpen: boolean = false;
  rowData = []
  selection: any|any[]
  emptyLabel: string = ""
  selectedLabel: string = ""

  @Output() callback = new EventEmitter<any>();
  @Input({ required: true }) objectType: string
  @Input() context
  @Input() items: any[]
  @Input() itemTextField: string
  @Input() multiple: boolean
  constructor(
    private objectService: GenericObjectService
  ) { }

  ngOnInit(): void {
    console.log("CranixSearchComponent")
    if (typeof this.items == "undefined") {
      console.log("items undefined")
      this.items = this.objectService.allObjects[this.objectType]
    }
    if (typeof this.multiple == "undefined") {
      console.log("multiple undefined")
      this.multiple = false;
    }
    if (typeof this.itemTextField == "undefined") {
      console.log("itemTextField undefined")
      this.itemTextField = "name";
    }
    if (this.multiple) {
      this.selection = []
    }
    this.emptyLabel = 'Select ' + this.objectType
    this.selectedLabel = this.objectType + 'selected.'
    this.rowData = this.items
  }

  private propagateOnChange = (_: any) => { };
  private propagateOnTouched = () => { };

  writeValue(value: any) {
    console.log("write value called")
    this.selection = value;
  }
  registerOnChange(method: any): void {
    this.propagateOnChange = method;
  }
  registerOnTouched(method: () => void) {
    this.propagateOnTouched = method;
  }
  openModal() {
    console.log(this.openModal)
    this.isCranixSearchModalOpen = true
  }
  closeModal(modal){
    modal.dismiss();
    this.isCranixSearchModalOpen = false
  }
  isSelected(id: number) {
    if (this.selection) {
      return this.selection.filter(o => o.id == id).length == 1
    }
    return false;
  }
  clearSelection(modal){
    if(this.multiple){
      this.selection = []
    }else{
      this.selection = null
    }
    this.propagateOnChange(this.selection);
    if(!this.multiple){
      this.closeModal(modal)
    }
  }
  select(o: any, modal) {
    this.selection = o;
    this.propagateOnChange(this.selection);
    if(this.callback){
      this.callback.emit();
    }
    this.closeModal(modal)
  }
  doSelect(o: any) {
    if(this.selection.filter(obj => obj.id == o.id).length == 1){
      this.selection = this.selection.filter(obj => obj.id != o.id)
    } else {
      this.selection.push(o)
    }
    console.log(this.selection)
  }
  returnValues(modal){
    this.propagateOnChange(this.selection);
    this.isCranixSearchModalOpen = false
    if(this.callback){
      this.callback.emit();
    }
    this.closeModal(modal)
  }
  onQuickFilterChanged() {
    let filter = (<HTMLInputElement>document.getElementById('crxSearchFilter')).value.toLowerCase();
    let tmp = []
    for (let o of this.items) {
      if (o[this.itemTextField].indexOf(filter) > -1) {
        tmp.push(o)
      }
    }
    this.rowData = tmp;
  }
}
