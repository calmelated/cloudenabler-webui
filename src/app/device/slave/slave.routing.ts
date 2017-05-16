import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'app/service';
import { Slave } from 'app/device/slave/slave.component';
import { SlaveEdit } from 'app/device/slave/edit/slaveEdit.component';

const routes: Routes = [
  { path: ':sn', component: Slave },
  { path: 'edit/:sn/:id', component: SlaveEdit },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalveRoutingModule { 
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