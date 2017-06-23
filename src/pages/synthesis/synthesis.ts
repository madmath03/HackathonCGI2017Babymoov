import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { Distributor } from '../distributors/distributors';
import { Product } from '../product-detail/product-detail';

export class Synthesis {
  constructor(
    public distributor: Distributor,
    public items: Array<Product>,
    public date: Date = new Date(),
    public alerts: Array<string> = [],
    public warnings: Array<string> = [],
    public notes: Array<string> = [],
    public advices: Array<string> = []
  ) { }

}

/**
 * Generated class for the SynthesisPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-synthesis',
  templateUrl: 'synthesis.html',
})
export class SynthesisPage {
  private loading: Loading;
  synthesis: Synthesis = null;
  ready: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController) {
    // If we navigated to this page, we might have items available as a nav param
    this.synthesis = new Synthesis(
      navParams.get('distributor'),
      navParams.get('items')
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynthesisPage');

    this.initSynthesis();
  }

  showLoading() {
    this.loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  initSynthesis() {
    // TODO Real analysis
    this.synthesis.alerts.push('Test Alert');
    this.synthesis.warnings.push('Test Warning');
    this.synthesis.notes.push('Test Note');
    this.synthesis.advices.push('Test Advice');
  }

}
