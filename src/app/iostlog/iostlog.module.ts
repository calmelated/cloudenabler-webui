import { NgModule, ApplicationRef } from '@angular/core';
import { IostlogRoutingModule } from 'app/iostlog/iostlog.routing';
import { Iostlog } from 'app/iostlog/iostlog.component';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    IostlogRoutingModule,
    SharedModule
  ],
  declarations: [
  	Iostlog
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class IostlogModule { }