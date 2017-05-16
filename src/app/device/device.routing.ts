import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Device } from 'app/device/device.component';
import { DeviceEdit } from 'app/device/edit/deviceEdit.component';
import { DeviceEvtlog } from 'app/device/evtlog/evtlog.component';
import { DeviceRegister } from 'app/device/register/register.component';
import { RegisterEdit } from 'app/device/register/edit/registerEdit.component';

const routes: Routes = [
  { path: '', component: Device },
  { path: 'edit/:sn', component: DeviceEdit },
  { path: 'register/edit/:sn/:id', component: RegisterEdit },
  { path: 'register/:sn/:id', component: DeviceRegister },
  { path: 'register/:sn', component: DeviceRegister },
  { path: 'evtlog/:sn', component: DeviceEvtlog }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule { }