import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

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
  //private loading: Loading;
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

  initSynthesis() {
    // TODO Real analysis
    this.synthesis.alerts.push('Test Alert');
    this.synthesis.warnings.push('Test Warning');
    this.synthesis.notes.push('Test Note');
    this.synthesis.advices.push('Test Advice');
  }

}
