import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-lookup',
  templateUrl: 'product-lookup.html',
})
export class ProductLookupPage {
  lookupItem: string = null;

  constructor(public viewCtrl: ViewController, 
    public navCtrl: NavController, public navParams: NavParams
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductLookupPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  validate() {
    this.viewCtrl.dismiss(this.lookupItem);
  }

}
