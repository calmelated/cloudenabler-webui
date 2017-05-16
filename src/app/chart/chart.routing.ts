import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Chart } from 'app/chart/chart.component';

const routes: Routes = [
  { path: '', component: Chart }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartRoutingModule { }