import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'app/service';
import { Companys } from 'app/superadmin';
import { Session } from 'app/superadmin';
import { FTP } from 'app/superadmin';
import { SMTP } from 'app/superadmin';
import { CSID } from 'app/superadmin';

const routes: Routes = [
  { path: 'companys', component: Companys },
  { path: 'csid', component: CSID },
  { path: 'smtp', component: SMTP },
  { path: 'sessions', component: Session },
  { path: 'ftp', component: FTP },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperadminRoutingModule { 
  constructor(
    private localStor: LocalStorageService,    
    private router: Router,    
  ) {
    if(this.localStor.get("userAdmin") === '0' || 
       this.localStor.get("subCompId") !== '0') {
      console.log('permisson deny');
      this.router.navigate(['/']);    
      return;
    }  
  }
}