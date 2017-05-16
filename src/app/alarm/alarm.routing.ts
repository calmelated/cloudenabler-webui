import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmLog } from 'app/alarm/alarm.component';

const routes: Routes = [
  { path: '', component: AlarmLog }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmRoutingModule { }