import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

/*
  判別輸入數字範圍與是否輸入數字以外文字
*/
export function NumberRangeValidator(range: number[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const number: number = parseInt(control.value);
    let start: number = range[0];
    let end: number = range[1];
    let patt: any = /[^0-9/-]/g;
    let result = patt.test(control.value);

    //判別輸入是否為0~9
    if(result) {
      return {'message': 'only_number'};
    }
 
    return (number >= start && number <= end)? null :{'range': start + "~" + end, 'message': 'allow_range'};
  };
}

@Directive({
  selector: '[NumberRange]',
  providers: [{provide: NG_VALIDATORS, useExisting: NumberRangeDirective, multi: true}]
})

export class NumberRangeDirective implements Validator, OnChanges {
  @Input() NumberRange: number[];
  private valFn = Validators.nullValidator;


  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['NumberRange'];
    if (change) {
      this.valFn = NumberRangeValidator(this.NumberRange);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}