import { Component} from '@angular/core';
import { EventEmitter} from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { ViewChild} from '@angular/core';
import { SimpleChange } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { GlobalService } from 'app/service';
const utils = require('app/share/utils.ts');

@Component({
  selector: 'modal-dialog',
  styleUrls: [ 'modal-dialog.component.css' ],
  templateUrl: 'modal-dialog.component.html'
})
export class ModalDialogComponent {
  @ViewChild('modalDialog') modalDialog: ModalComponent;
  @Input() openModalDialog;
  @Output() evtClose: EventEmitter<any> = new EventEmitter<any>();

  modalDialogTitle: string = 'caution';
  modalDialogStr: string;
  cbFunc: string;
  yesNoFunc: string;
  confirmClass: string = "btn btn-primary";

  constructor(
    private global: GlobalService,
  ) {}

  onClose(ans) {
    if(ans && this.cbFunc) {
       this.evtClose.emit(this.cbFunc);
    } else if(ans && this.yesNoFunc) {
       this.evtClose.emit(this.yesNoFunc);
    }
  }

  ngOnChanges(changes: {[key: string]: any}) {
    if(changes['openModalDialog']) {
      let dialog = changes['openModalDialog'].currentValue
      dialog = utils.toJson(dialog);
      if(!dialog) {
        return;
      }
      if(dialog.action === 'open') {
        this.modalDialogTitle = (dialog.title) ? dialog.title : 'caution' ;
        this.modalDialogStr = (dialog.str) ? this.global.langStr(dialog.str) : '' ;
        this.cbFunc = (dialog.cbFunc) ? dialog.cbFunc : null;
        this.yesNoFunc = (dialog.yesNoFunc) ? dialog.yesNoFunc : null;
        this.confirmClass = (dialog.important) ? 'btn btn-danger' : 'btn btn-primary' ;
        this.modalDialog.open();
      } else if(dialog.action === 'close') {
        this.modalDialog.close();          
      }
    }
  }
}