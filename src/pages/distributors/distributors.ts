import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import { ProductsPage } from '../products/products';

export interface Distributor {
  distributor: string;
  lattitude: number;
  longitude: number;
  address: string;
  city: string;
  postalCode: string;
  photo: string;
}

@Component({
  selector: 'page-distributors',
  templateUrl: 'distributors.html'
})
export class DistributorsPage {
  private loading: Loading;
  selectedItem: any;
  posOptionsLat: number;
  posOptionsLong: number;
  items: Array<Distributor>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _loadingCtrl: LoadingController,
    private _geolocation: Geolocation,
    private _http: Http) {
    // Get current position
    _geolocation.getCurrentPosition().then(pos => {
      this.posOptionsLat = pos.coords.latitude;
      this.posOptionsLong = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    // Watch current position
    const watch = _geolocation.watchPosition().subscribe(pos => {
      this.posOptionsLat = pos.coords.latitude;
      this.posOptionsLong = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    // to stop watching
    watch.unsubscribe();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorsPage');

    this.items = this.loadAllDistributors();
  }

  showLoading() {
    this.loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  itemTapped(event, item: Distributor) {
    this.showLoading();

    // We're pushing to the products
    this.navCtrl.push(ProductsPage, {
      item: item
    });
  }

  loadAllDistributors() {
    this.showLoading();
    console.log('Loading distributors...');
    var items = [];

    this._http.get('assets/data/distributor.json')
      .map(res => res.json())
      .subscribe(
      data => {
        data.forEach((item) => {
          items.push(item);
        });
      },
      err => this.handleErrors(err),
      () => { console.log('Distributors load ended.'); this.loading.dismiss(); }
      );

    return items;
  }

  private handleErrors(error: Response) {
    if (typeof error.json === 'function') {
      console.log(JSON.stringify(error.json()));
    } else {
      console.dir(error);
    }
  };

  getItems(ev: any) {
    // Reset items back to all of the items

    // set val to the value of the searchbar
    let val = ev.target.value;

    if (ev.cancelable) {
      this.items = this.loadAllDistributors();
    }

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.distributor.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.address.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.city.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.postalCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else if (val == '') {
      this.items = this.loadAllDistributors();
    }
  }

}
