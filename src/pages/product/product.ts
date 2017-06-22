import { Component } from '@angular/core';
import { Http, Response } from "@angular/http";
import { NavController, NavParams } from 'ionic-angular';

import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  currentDistributor: string = 'Maxi Toys';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _barcodeScanner: BarcodeScanner, private _http: Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

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

    this._http.get('assets/data/distributor.json')
      .map(res => res.json())
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        data.forEach((item) => {
          if (item.distributor === this.currentDistributor) {
            for (let product of item.product) {
              items.push({
                title: product.description,
                note: product.recommendedPrice,
                icon: ''
              }
              );
            }
          }
        });
      },
      err => this.handleErrors(err),
      () => console.log('Products load ended.')
      );

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

  private handleErrors(error: Response) {
    if (typeof error.json === 'function') {
      console.log(JSON.stringify(error.json()));
    } else {
      console.dir(error);
    }
  }
}
