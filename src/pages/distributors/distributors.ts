import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { IonicPage } from 'ionic-angular';

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

declare var google;

@Component({
  selector: 'page-distributors',
  templateUrl: 'distributors.html'
})
export class DistributorsPage {

  @ViewChild('map') mapElement: ElementRef;
  private loading: Loading;
  selectedItem: any;
  posOptionsLat: number;
  posOptionsLong: number;
  items: Array<Distributor>;

  map: any;
  latitude: any;
  longitude: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  markers: any = [];
  //items: Array<Distributor>;
  locations: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _loadingCtrl: LoadingController,
    private _geolocation: Geolocation,
    private _http: Http) {

    this.latitude = 45.7892526;
    this.longitude = 3.1060942999999996;
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
    this.initMap();
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
          this.addMarker(item.lattitude, item.longitude, false, item.photo);
        });
        this.applyHaversine(items);
      },
      err => this.handleErrors(err),
      () => { console.log('Distributors load ended.'); }
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

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: { lat: this.latitude, lng: this.longitude }
    });

    this.directionsDisplay.setMap(this.map);
    this.items = this.loadAllDistributors();

    this.addMarker(this.latitude, this.longitude, true, null);
  }

  addMarker(lat: number, lng: number, user: boolean, photo: any): void {

    let latLng = new google.maps.LatLng(lat, lng);
    var marker;
    if (user) {
      let marker = new google.maps.Marker({
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    } else {
      var icon = {
        url: photo, // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };

      let marker = new google.maps.Marker({
        icon: icon,
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    }

    this.markers.push(marker);

  }

  applyHaversine(locations) {

    let usersLocation = {
      lat: 45.7892526,
      lng: 3.1060942999999996
    };

    locations.map((location) => {

      let placeLocation = {
        lat: location.lattitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    locations.sort((locationA, locationB) => {
      return locationA.distance - locationB.distance;
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
