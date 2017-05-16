import { NgModule, ApplicationRef } from '@angular/core';
import { GroupRoutingModule } from 'app/group/group.routing';
import { Group } from 'app/group';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    GroupRoutingModule,
    SharedModule
  ],
  declarations: [
  	Group
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class GroupModule { }