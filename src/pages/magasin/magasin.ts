import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-magasin',
  templateUrl: 'magasin.html'
})
export class MagasinPage {
  selectedItem: any;
  icons: string[];
  posOptionsLat: any;
  posOptionsLong: any;
  items: Array<{title: string, note: string, icon: string}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
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
  }
}
