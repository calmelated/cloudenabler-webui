import { NgModule, ApplicationRef } from '@angular/core';
import { AlarmRoutingModule } from 'app/alarm/alarm.routing';
import { AlarmLog } from 'app/alarm/alarm.component';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    AlarmRoutingModule,
    SharedModule
  ],
  declarations: [
  	AlarmLog
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class AlarmModule { }