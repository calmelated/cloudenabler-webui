import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Flink } from 'app/flink';

const routes: Routes = [
  { path: '', component: Flink }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlinkRoutingModule { }