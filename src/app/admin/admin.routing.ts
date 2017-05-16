import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'app/service';
import { Accounts } from 'app/admin';
import { AccountAuth } from 'app/admin';
import { AuditLog } from 'app/admin';
import { Company } from 'app/admin';
import { SubCompany } from 'app/admin';
import { LiluSubCompany } from 'app/admin';

const routes: Routes = [
  { path: '', component: Accounts },
  { path: 'accounts', component: Accounts },
  { path: 'accounts/auth/:account', component: AccountAuth },
  { path: 'audit', component: AuditLog },
  { path: 'company', component: Company },
  { path: 'subcompany', component: SubCompany },
  { path: 'lilu/subcompany', component: LiluSubCompany }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { 
  constructor(
    private localStor: LocalStorageService,    
    private router: Router,        
  ) {
    if(this.localStor.get("userAdmin") === '1' || 
       this.localStor.get("userAdmin") === '2') {
      return; // ok user
    } else {
      console.log('permisson deny');
      this.router.navigate(['/']);      
      return; // permisson deny
    }        
  }
}