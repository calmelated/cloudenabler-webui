import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Group } from 'app/group';

const routes: Routes = [
  { path: '', component: Group }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }