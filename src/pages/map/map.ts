import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';

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

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  posOptionsLat: number;
  posOptionsLong: number;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latitude: any;
  longitude:any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  markers: any = [];
  items: Array<Distributor>;
  locations:any =[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation,
    private _http: Http) {

  	this.latitude = 45.7892526;
  	this.longitude = 3.1060942999999996;
  	// get current position
    geolocation.getCurrentPosition().then(pos => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    const watch = geolocation.watchPosition().subscribe(pos => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });

    // to stop watching
    watch.unsubscribe();

  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: { lat: this.latitude, lng: this.longitude }
    });

    this.directionsDisplay.setMap(this.map);
    this.items = this.loadAllDistributors();

    this.addMarker(this.latitude, this.longitude);
  }

  addMarker(lat: number, lng: number): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    this.markers.push(marker);  
      
  }

  private handleErrors(error: Response) {
    if (typeof error.json === 'function') {
      console.log(JSON.stringify(error.json()));
    } else {
      console.dir(error);
    }
  };

  loadAllDistributors() {
    console.log('Loading distributors...');
    var items = [];

    this._http.get('assets/data/distributor.json')
      .map(res => res.json())
      .subscribe(
      data => {
        data.forEach((item) => {
          items.push(item);
           this.addMarker(item.lattitude, item.longitude);
           
        });
        this.applyHaversine(items);
      },
      err => this.handleErrors(err),
      () => { console.log('Distributors load ended.'); }
      );

    return items;
  }

  applyHaversine(locations){

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

		return locations;
	}

	getDistanceBetweenPoints(start, end, units){

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

	toRad(x){
		return x * Math.PI / 180;
	}


  /*calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }*/

}