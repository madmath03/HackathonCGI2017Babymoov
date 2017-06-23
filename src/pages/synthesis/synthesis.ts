import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';

import { Distributor } from '../distributors/distributors';
import { Product } from '../product-detail/product-detail';

export class Synthesis {
  constructor(
    public distributor: Distributor,
    public items: Array<Product>,
    public date: Date = new Date(),
    public title: string = null,
    public alerts: Array<string> = [],
    public warnings: Array<string> = [],
    public notes: Array<string> = [],
    public advices: Array<string> = []
  ) {
    this.title = 'Synthèse' 
      + (this.distributor == null ? '' : ' ' + this.distributor.distributor) 
      + ' ' 
      + this.date.getDate() + '/' + this.date.getMonth() + '/' + this.date.getFullYear();
  }

}

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
    private _loadingCtrl: LoadingController,
    private _socialSharing: SocialSharing) {
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

  shareSynthesis() {
    var message: string = '';

    for (var alert of this.synthesis.alerts) {
      message = message + '\n' + alert;
    }

    message = message + '\n';

    for (var warning of this.synthesis.warnings) {
      message = message + '\n' + warning;
    }

    message = message + '\n';

    for (var note of this.synthesis.notes) {
      message = message + '\n' + note;
    }

    message = message + '\n';

    for (var advice of this.synthesis.advices) {
      message = message + '\n' + advice;
    }
    
    this._socialSharing.share(message, this.synthesis.title);
  }

  initSynthesis() {
    // TODO Real analysis
    this.synthesis.alerts.push('Test Alert');
    this.synthesis.warnings.push('Test Warning');
    this.synthesis.notes.push('Test Note');
    this.synthesis.advices.push('Test Advice');
  }

}
