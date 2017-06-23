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
    public actualPrice: number = null,
    public quantity: number = null,
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
  temporaryItem: Product = null;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    console.log(this.selectedItem);

    this.temporaryItem = new Product(this.selectedItem.description, this.selectedItem.barcode, this.selectedItem.ref,
      this.selectedItem.photo, this.selectedItem.starRating,
      this.selectedItem.recommendedPrice, this.selectedItem.recommendedPriceP, this.selectedItem.recommendedPriceM,
      this.selectedItem.oldQty, this.selectedItem.actualPrice, this.selectedItem.quantity, this.selectedItem.found
    );
    console.log(this.temporaryItem);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  validate() {
    this.selectedItem.actualPrice = this.temporaryItem.actualPrice;
    this.selectedItem.quantity = this.temporaryItem.quantity;

    this.viewCtrl.dismiss(this.selectedItem);
  }

}
