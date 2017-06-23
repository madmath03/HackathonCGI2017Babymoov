import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductLookupPage } from './product-lookup';

@NgModule({
  declarations: [
    ProductLookupPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductLookupPage),
  ],
  exports: [
    ProductLookupPage
  ]
})
export class ProductLookupPageModule {}
