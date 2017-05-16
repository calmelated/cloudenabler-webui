import { NgModule } from '@angular/core';
import { AdminRoutingModule } from 'app/admin/admin.routing';
import { Accounts } from 'app/admin';
import { AccountAuth } from 'app/admin';
import { AuditLog } from 'app/admin';
import { Company } from 'app/admin';
import { SubCompany } from 'app/admin';
import { LiluSubCompany } from 'app/admin';
import { SharedModule } from 'app/share/share.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule
  ],
  exports: [],
  declarations: [
  	Accounts, 
  	AccountAuth, 
  	AuditLog, 
  	Company, 
  	SubCompany,
    LiluSubCompany
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class AdminModule { }