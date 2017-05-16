import { NgModule } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//外部套件
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CustomFormsModule } from 'ng2-validation'
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';

import { LoadingSpinnerComponent } from '../layout/loading-spinner.component';
import { LayoutHeaderComponent } from '../layout/layout-header.component';
import { ModalDialogComponent } from '../layout/modal-dialog.component';
import { InputCheckDirective } from '../directive/input-check.directive';
import { NumberRangeDirective } from '../directive/number-range.directive';
import { DropdownDirective } from '../directive/dropdown.directive';

@NgModule({
  imports: [
    CommonModule,
    CustomFormsModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    Ng2Bs3ModalModule,
    Ng2DatetimePickerModule
  ],
  declarations: [ 
    InputCheckDirective, 
    NumberRangeDirective,
    DropdownDirective,
    ModalDialogComponent,
    LayoutHeaderComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    Ng2Bs3ModalModule,
    Ng2DatetimePickerModule,
    CustomFormsModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    HttpModule,
    ModalDialogComponent,
    LayoutHeaderComponent,
    LoadingSpinnerComponent,
    InputCheckDirective,
    NumberRangeDirective,
    DropdownDirective
  ]
})

export class SharedModule { }