import { NgModule, ApplicationRef } from '@angular/core';
import { AnnouncementRoutingModule } from 'app/announcement/announcement.routing';
import { Announcement } from 'app/announcement';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    AnnouncementRoutingModule,
    SharedModule
  ],
  declarations: [
  	Announcement
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class AnnouncementModule { }