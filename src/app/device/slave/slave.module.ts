import { NgModule } from '@angular/core';
import { SalveRoutingModule } from 'app/device/slave/slave.routing';
import { Slave } from 'app/device/slave/slave.component';
import { SlaveEdit } from 'app/device/slave/edit/slaveEdit.component';
import { SharedModule } from 'app/share/share.module';
import { ApiService, } from 'app/service';
import { GlobalService } from 'app/service';
import { LocalStorageService } from 'app/service';

@NgModule({
  imports: [
    SalveRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
  	Slave,
    SlaveEdit,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ApiService,
    GlobalService,
    LocalStorageService
  ]
})
export class SlaveModule { }