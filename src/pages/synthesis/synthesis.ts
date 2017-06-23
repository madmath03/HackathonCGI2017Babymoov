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
  warningFound: boolean = false;
  alertFound: boolean = false;

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
    
    this.checkPriceDiff();
    this.checkStock();

    //this.synthesis.notes.push('Test Note');
    //this.synthesis.advices.push('Test Advice');
  }

  checkPriceDiff(){

      var warningMsg = "Les produits suivants sont vendus en dessus du prix de référence : ";
      for (var _i = 0; _i < this.synthesis.items.length; _i++) {
        var recommendedPrice = this.synthesis.items[_i].recommendedPrice;
        var actualPrice = this.synthesis.items[_i].actualPrice;
        
        if (this.synthesis.items[_i].starRating == 5 && recommendedPrice != actualPrice){
          if(recommendedPrice > actualPrice){
           warningMsg += this.synthesis.items[_i].description + " (ref " + this.synthesis.items[_i].ref + "), ";
           this.warningFound = true;
          }
        }
        
      }

      if(this.warningFound){
          warningMsg = warningMsg.substring(0, warningMsg.length - 2);
          this.synthesis.warnings.push(warningMsg);
      }

  }


  
  checkStock(){

      var alertMsg = "Les produits suivants ne sont plus en stock chez le client : ";

      for (var _i = 0; _i < this.synthesis.items.length; _i++) {
        var quantity = this.synthesis.items[_i].quantity;

        if (quantity == 0){
          alertMsg += this.synthesis.items[_i].description + " (ref " + this.synthesis.items[_i].ref + "), ";
          this.alertFound = true;
      }
        
      }

      if(this.alertFound == true){
        alertMsg = alertMsg.substring(0, alertMsg.length - 2);
        this.synthesis.alerts.push(alertMsg);
      }

  }

}
