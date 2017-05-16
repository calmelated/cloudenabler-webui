import { NgModule, ApplicationRef } from '@angular/core';
import { ChartRoutingModule } from 'app/chart/chart.routing';
import { Chart } from 'app/chart/chart.component';
import { SharedModule } from 'app/share/share.module';
import { ApiService, GlobalService } from 'app/service';
import { Ng2HighchartsModule } from 'ng2-highcharts';

@NgModule({
  imports: [
    ChartRoutingModule,
    SharedModule,
    Ng2HighchartsModule
  ],
  declarations: [
  	Chart
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class ChartModule { }