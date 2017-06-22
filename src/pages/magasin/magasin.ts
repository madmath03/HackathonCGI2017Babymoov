import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import { ProductPage } from '../product/product';

@Component({
  selector: 'page-magasin',
  templateUrl: 'magasin.html'
})
export class MagasinPage {
  selectedItem: any;
  icons: string[];
  posOptionsLat: any;
  posOptionsLong: any;
  items: Array<{ title: string, note: string, icon: string }>;

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
    this.navCtrl.push(ProductPage, {
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
          items.push({
            title: item.distributor,
            note: item.address
          }
          );
        });
      },
      err => this.handleErrors(err),
      () => console.log('Distributors load ended.')
      );

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
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else if(val == ''){
      this.items = this.loadAllMagasins();
    }
  }

}
