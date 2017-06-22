import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _barcodeScanner: BarcodeScanner) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    // TODO Get items for client from API
    this.items = this.loadProducts();
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ProductPage, {
      item: item
    });
  }

  loadProducts() {
    var items = [];
/*
    for (let i = 1; i < 11; i++) {
      items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
*/
    return items;
  }

  findProduct(barcodeData: BarcodeScanResult) {
    return {
      title: barcodeData.text,
      note: '',
      icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    };
  }

  scanProduct(event) {
    this._barcodeScanner.scan().then((barcodeData: BarcodeScanResult) => {
      // Success! Barcode data is here
      console.log(new Date().toJSON() + ': Success !');
      if (!barcodeData.cancelled) {
        console.log(barcodeData);
        alert('Produit : ' + barcodeData.text);
        var product = this.findProduct(barcodeData);
        this.items.push(product);
      }
    }, (err) => {
      // An error occurred
      console.log(new Date().toJSON() + ': An error occurred !');
      console.log(err);
      alert('Une erreur c\'est produite!');
    });
  }
}
