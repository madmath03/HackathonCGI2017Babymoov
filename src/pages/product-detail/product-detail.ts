import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

export class Product {
  constructor(
    public description: string,
    public barcode: string,
    public ref: string = null,
    public photo: string = null,
    public starRating: number = 0,
    public recommendedPrice: number = 0,
    public recommendedPriceP: number = 0,
    public recommendedPriceM: number = 0,
    public oldQty: number = null,
    public actualPrice: number = 100,
    public quantity: number = 0,
    public found: boolean = false) {
  }
}

/**
 * Generated class for the ProductDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  selectedItem: Product = null;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  validate() {
    this.viewCtrl.dismiss(this.selectedItem);
  }

}
