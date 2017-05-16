import { NgModule, ApplicationRef } from '@angular/core';
import { SuperadminRoutingModule } from 'app/superadmin/superadmin.routing';
import { Companys, Session, FTP, SMTP, CSID } from 'app/superadmin';
import { SharedModule } from 'app/share/share.module';

@NgModule({
  imports: [
    SuperadminRoutingModule,
    SharedModule
  ],
  declarations: [
  	Companys, 
  	Session, 
  	FTP,
    SMTP,
    CSID
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class SuperadminModule { }