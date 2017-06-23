import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SynthesisPage } from './synthesis';

@NgModule({
  declarations: [
    SynthesisPage,
  ],
  imports: [
    IonicPageModule.forChild(SynthesisPage),
  ],
  exports: [
    SynthesisPage
  ]
})
export class SynthesisPageModule {}
