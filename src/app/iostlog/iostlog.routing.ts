import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Iostlog } from 'app/iostlog';

const routes: Routes = [
  { path: '', component: Iostlog }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IostlogRoutingModule { }