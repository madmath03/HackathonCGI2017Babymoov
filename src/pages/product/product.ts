import { Component } from '@angular/core';
import { Http, Response } from "@angular/http";
import { NavController, NavParams } from 'ionic-angular';

import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { Ionic2RatingModule } from 'ionic2-rating';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, found: boolean, barcode: string }>;
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
    /*
    this.navCtrl.push(ProductPage, {
      item: item
    });
    */
    //item.found = !item.found;
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
                ref : product.ref,
                rating : product.starRating,
                note: product.recommendedPrice,
                found: false,
                barcode: product.barcode,
                photo : product.photo
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
    if (barcodeData.cancelled) {
      return null;
    }

    let product = null;
    // Find product in distributor list
    for (let item of this.items) {
      if (item.barcode === barcodeData.text) {
        item.found = true;
        product = item;
        break;
      }
    }

    // Product not found ==> new temp product for alert
    if (product == null) {
      product = {
        title: barcodeData.text,
        note: '',
        found: false,
        barcode: barcodeData.text
      };
    }

    return product;
  }

  scanProduct(event) {
    this._barcodeScanner.scan().then((barcodeData: BarcodeScanResult) => {
      // Success! Barcode data is here
      console.log(new Date().toJSON() + ': Success !');
      let product = this.findProduct(barcodeData);
      if (product) {
        if (product.found) {
          console.log('Product ' + product.title + ' added.');
        } else {
          console.log('Unknown product ' + product.title);
          alert('Référence produit "' + product.title + '" inconnue!');
        }
      } else {
          console.log('No product found.');
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
