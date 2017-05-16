import { NgModule, ApplicationRef } from '@angular/core';
import { FlinkRoutingModule } from 'app/flink/flink.routing';
import { Flink } from 'app/flink';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    FlinkRoutingModule,
    SharedModule
  ],
  declarations: [
  	Flink
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class FlinkModule { }