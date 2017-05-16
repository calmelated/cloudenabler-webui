import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';
import { GlobalService } from 'app/service';
const utils = require('app/share/utils.ts');

/*
  判別密碼至少要有 一大寫英文 一小寫英文  跟數字
*/
export function InputValidator(valid): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if(typeof control.value !== 'string') {
      return null;
    } 
    const input = control.value;
    valid = utils.toJson(valid);
    let result = utils.validInput(valid, input);
    if(!result || !valid)  {
      return null;
    } 
    let ret = {};
    ret['str'] = result.str;
    if(valid.type) {
      ret[valid.type] = true;
    } else if(valid.strlen) { // strlen = [6, 32]
      ret['strlen'] = true;
    } else if(valid.range) { // number range = [10, 65535]
      ret['range'] = true;
    }     
    return ret;
  };
}

@Directive({
  selector: '[chkstr]',
  providers: [{provide: NG_VALIDATORS, useExisting: InputCheckDirective, multi: true}]
})
export class InputCheckDirective implements Validator, OnChanges {
  @Input() chkstr: string;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['chkstr'];
    if (change) {
      this.valFn = InputValidator(this.chkstr);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}