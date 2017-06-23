import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-distributors',
  templateUrl: 'distributors.html'
})
export class DistributorsPage {
  selectedItem: any;
  posOptionsLat: any;
  posOptionsLong: any;
  items: Array<{ distributor: string, address: string, city: string, postalCode: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private _http: Http) {
    // If we navigated to this page, we will have an item available as a nav param



    // get current position
    geolocation.getCurrentPosition().then(pos => {
      this.posOptionsLat = pos.coords.latitude;
      this.posOptionsLong = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    const watch = geolocation.watchPosition().subscribe(pos => {
      this.posOptionsLat = pos.coords.latitude;
      this.posOptionsLong = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    // to stop watching
    watch.unsubscribe();

    this.items = this.loadAllMagasins();

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ProductsPage, {
      item: item
    });
  }

  loadAllMagasins() {
    console.log('Loading distributors...')
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
      () => console.log('Distributors load ended.')
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

    if(ev.cancelable){
      this.items = this.loadAllMagasins();
    }

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.distributor.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.address.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.city.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.postalCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else if(val == ''){
      this.items = this.loadAllMagasins();
    }
  }

}
