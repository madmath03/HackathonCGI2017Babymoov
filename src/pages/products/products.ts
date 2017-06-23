import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ModalController, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';

import { Distributor } from '../distributors/distributors';
import { Product, ProductDetailPage } from '../product-detail/product-detail';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  private loading: Loading;
  selectedItem: Distributor = null;
  items: Array<Product>;

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
    this.loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  itemTapped(event, item: Product) {
    console.log('Item tapped: ' + item.description);
    this.presentProductModal(item);
  }

  presentProductModal(item: Product) {
    let productModal = this._modalCtrl.create(ProductDetailPage, {
      item: item
    });

    productModal.onDidDismiss(data => {
      console.log(productModal);
    });

    productModal.present();
  }

  validate() {
    // TODO Push to 
    console.log('Moving to validation page');
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
        () => { console.log('Products load ended.'); this.loading.dismiss(); }
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
        () => { console.log('Products load ended.'); this.loading.dismiss(); }
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
    } else if (product.starRating === 5) {
      // If top product, edit
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

  scanProduct(event) {
    this.loading.dismiss();

    this._barcodeScanner.scan(this.options).then((barcodeData: BarcodeScanResult) => {
      // Success! Barcode data is here
      console.log(new Date().toJSON() + ': Success !');
      let product: Product = this.findProduct(barcodeData);
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
    }, (err) => {
      // An error occurred
      console.log(new Date().toJSON() + ': An error occurred !');
      console.log(err);
      this.showMessage('Une erreur c\'est produite!');
    });
  }

  showMessage(text) {
    this.loading.dismiss();

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