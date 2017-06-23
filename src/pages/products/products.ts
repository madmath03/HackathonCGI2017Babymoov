import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ModalController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';

import { Distributor } from '../distributors/distributors';
import { Product, ProductDetailPage } from '../product-detail/product-detail';
import { ProductLookupPage } from '../product-lookup/product-lookup';
import { SynthesisPage } from '../synthesis/synthesis';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  //private loading: Loading;
  selectedItem: Distributor = null;
  items: Array<Product>;
  lookupItem: string = null;

  options: BarcodeScannerOptions = {
    preferFrontCamera: false,
    showTorchButton: true,
    prompt: 'Scannez un code barre',
    formats: 'EAN_13',
    resultDisplayDuration: 500
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _barcodeScanner: BarcodeScanner, private _http: Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');

    this.items = this.loadProducts();
  }

  showLoading() {
    // FIXME Uncaught (in promise): removeView was not found
    /*
    Error: Uncaught (in promise): removeView was not found
    at c (http://localhost:8100/build/polyfills.js:3:13535)
    at c (http://localhost:8100/build/polyfills.js:3:13221)
    at http://localhost:8100/build/polyfills.js:3:14067
    at t.invokeTask (http://localhost:8100/build/polyfills.js:3:9967)
    at Object.onInvokeTask (http://localhost:8100/build/main.js:4640:37)
    at t.invokeTask (http://localhost:8100/build/polyfills.js:3:9888)
    at r.runTask (http://localhost:8100/build/polyfills.js:3:5143)
    at o (http://localhost:8100/build/polyfills.js:3:2203)
    at <anonymous>
    */
    /*
    this.loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this.loading.present();
    */
  }

  itemTapped(event, item: Product) {
    console.log('Item tapped: ' + item.description);
    this.presentProductModal(item);
  }

  presentProductModal(item: Product) {
    if (item.starRating !== 5) {
      return;
    }

    // If top product, edit
    let productModal = this._modalCtrl.create(ProductDetailPage, {
      item: item
    });

    productModal.onDidDismiss(data => {
      console.log(productModal);
    });

    productModal.present();
  }

  validate() {
    console.log('Moving to validation page');

    // We're pushing to the synthesis
    this.navCtrl.push(SynthesisPage, {
      distributor: this.selectedItem,
      items: this.items
    });
  }

  loadProducts() {
    this.showLoading();
    var items = [];

    if (this.selectedItem == null) {
      console.log('Loading all products...');

      this._http.get('assets/data/product.json')
        .map(res => res.json())
        .subscribe(
        data => {
          data.forEach((item) => {
            items.push(new Product(
              item.description, item.barcode, item.ref,
              item.photo, item.starRating, item.recommendedPrice, (item.recommendedPrice + item.recommendedPrice * 0.1), (item.recommendedPrice - item.recommendedPrice * 0.1), item.oldQty
            ));
          });
        },
        err => this.handleErrors(err),
        () => { console.log('Products load ended.'); /* this.loading.dismiss();*/ }
        );

    } else {
      console.log('Loading products for ' + this.selectedItem.distributor + '...');

      this._http.get('assets/data/distributor.json')
        .map(res => res.json())
        .subscribe(
        data => {
          data.forEach((item) => {
            if (item.distributor === this.selectedItem.distributor) {
              for (let product of item.product) {
                product.found = false;
                items.push(new Product(
                  product.description, product.barcode, product.ref,
                  product.photo, product.starRating, product.recommendedPrice, (product.recommendedPrice + product.recommendedPrice * 0.1), (product.recommendedPrice - product.recommendedPrice * 0.1), product.oldQty
                ));
              }
            }
          });

          items.sort(this.sortProducts);
        },
        err => this.handleErrors(err),
        () => { console.log('Products load ended.'); /*this.loading.dismiss();*/ }
        );

    }

    return items;
  }

  findProduct(barcodeData: BarcodeScanResult): Product {
    if (barcodeData.cancelled) {
      return null;
    }

    let product: Product = null;
    // Find product in distributor list
    for (var _i = 0; _i < this.items.length; _i++) {
      var item: Product = this.items[_i];

      if (item.barcode === barcodeData.text) {
        item.found = true;
        product = item;
        break;
      }
    }

    // Product not found ==> new temp product for alert
    if (product == null) {
      product = new Product(
        barcodeData.text, barcodeData.text
      );
    } else {
      this.presentProductModal(product);
    }

    this.items.sort(this.sortProducts);

    return product;
  }

  sortProducts(a: Product, b: Product) {
    if (a.found == b.found)
      return b.starRating - a.starRating;
    if (a.found) {
      return -1;
    }
  }

  searchProduct(event) {
    /*
    let productModal = this._modalCtrl.create(ProductLookupPage);

    productModal.onDidDismiss(data => {
      if (data) {
        let product: Product = this.findProduct(
          {
            format: 'EAN_13',
            cancelled: false,
            text: data
          }
        );
        this.checkProduct(product);
      }
    });

    productModal.present();
    */

    if (this.lookupItem) {
      let product: Product = this.findProduct(
        {
          format: 'EAN_13',
          cancelled: false,
          text: this.lookupItem
        }
      );
      this.checkProduct(product);
    }

  }

  checkProduct(product: Product) {
    if (product) {
      if (product.found) {
        console.log('Product ' + product.description + ' added.');
      } else {
        console.log('Unknown product ' + product.description);

        this.showMessage('Référence produit "' + product.description + '" inconnue!');
      }
    } else {
      console.log('No product found.');
    }
  }

  scanProduct(event) {
    //this.loading.dismiss();

    this._barcodeScanner.scan(this.options).then((barcodeData: BarcodeScanResult) => {
      // Success! Barcode data is here
      console.log(new Date().toJSON() + ': Success !');
      let product: Product = this.findProduct(barcodeData);
      this.checkProduct(product);
    }, (err) => {
      // An error occurred
      console.log(new Date().toJSON() + ': An error occurred !');
      console.log(err);
      this.showMessage('Une erreur c\'est produite!');
    });
  }

  showMessage(text) {
    //this.loading.dismiss();

    let alert = this._alertCtrl.create({
      title: 'Echec',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  private handleErrors(error: Response) {
    if (typeof error.json === 'function') {
      console.log(JSON.stringify(error.json()));
    } else {
      console.dir(error);
    }
  }
}
