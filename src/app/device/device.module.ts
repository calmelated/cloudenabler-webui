import { NgModule, ApplicationRef } from '@angular/core';
import { DeviceRoutingModule } from 'app/device/device.routing';
import { SharedModule } from 'app/share/share.module';
import { Device, DeviceEdit, DeviceEvtlog, DeviceRegister, RegisterEdit } from 'app/device';
import { ApiService, GlobalService } from 'app/service';

@NgModule({
  imports: [
    DeviceRoutingModule,
    SharedModule
  ],
  declarations: [
  	Device, 
  	DeviceEdit, 
  	DeviceEvtlog,
  	DeviceRegister, 
  	RegisterEdit
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  ]
})
export class DeviceModule { }