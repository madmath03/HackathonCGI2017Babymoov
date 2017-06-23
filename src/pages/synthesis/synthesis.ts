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
    public warnings: Array<{title : string, message :Array<String>}> = [],
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
  warningFound: boolean = false;
  alertFound: boolean = false;

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

  showMessage(text, title = 'Echec') {
    //this.loading.dismiss();

    let alert = this._alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  shareSynthesis() {
    var message: string = 'Bonjour,';

    for (var alert of this.synthesis.alerts) {
      message = message + '\n' + alert;
    }

    message = message + '\n';

    for (var warning of this.synthesis.warnings) {
      message = message + '\n' + warning.title;
      for (var msg of warning.message) {
        message = message + '\n\t' + msg;
      }
    }

    message = message + '\n';

    for (var note of this.synthesis.notes) {
      message = message + '\n' + note;
    }

    message = message + '\n';

    for (var advice of this.synthesis.advices) {
      message = message + '\n' + advice;
    }

    message = message + '\n'
      + 'Pour plus d\'informations consultez le site de l\'application: '
      + 'https://github.com/madmath03/HackathonCGI2017Babymoov';

    console.log(message);

    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      message: message,
      subject: '[BABYMOOV] ' + this.synthesis.title,
      files: ['', ''],
      url: '',
      chooserTitle: 'Choissisez une application'
    };

    this._socialSharing.shareWithOptions(options).then((result) => {
      console.log('Share successful!');

      // On Android apps mostly return false even while it's true
      console.log("Share completed? " + result.completed);
      // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
      console.log("Shared to app: " + result.app);
    }).catch((err) => {
      console.log('Something went wrong!');
      console.log(err);
      this.showMessage('Une erreur c\'est produite durant le partage!');
    });
  }

  initSynthesis() {
    // TODO Real analysis

    this.checkPriceDiff();
    //this.checkStock();

    //this.synthesis.notes.push('Test Note');
    //this.synthesis.advices.push('Test Advice');
  }

  checkPriceDiff(){

      var warningMsg = "";
      var warn ={title : "Les produits suivants sont vendus en dessus du prix de référence : ",message :[]};
      for (var _i = 0; _i < this.synthesis.items.length; _i++) {
        var recommendedPrice = this.synthesis.items[_i].recommendedPrice;
        var actualPrice = this.synthesis.items[_i].actualPrice;
        if (actualPrice != null)
        if (this.synthesis.items[_i].starRating == 5 && recommendedPrice != actualPrice){
          if(recommendedPrice > actualPrice){
           warn.message.push(this.synthesis.items[_i].description + " (ref " + this.synthesis.items[_i].ref + "), ");
           this.warningFound = true;
          }
        }

      }

      if(this.warningFound){
          warningMsg = warningMsg.substring(0, warningMsg.length - 2);
          this.synthesis.warnings.push(warn);
      }

  }



  checkStock(){

        var warningMsg = "";
      var warn ={title : "Les produits suivants ne sont plus en stock chez le client : ",message :[]};

      for (var _i = 0; _i < this.synthesis.items.length; _i++) {
        var quantity = this.synthesis.items[_i].quantity;

        if (quantity == 0){
          //alertMsg += this.synthesis.items[_i].description + " (ref " + this.synthesis.items[_i].ref + "), ";
          warn.message.push(this.synthesis.items[_i].description + " (ref " + this.synthesis.items[_i].ref + "), ");
         this.warningFound = true;
      }

      }


            if(this.warningFound){
                warningMsg = warningMsg.substring(0, warningMsg.length - 2);
                this.synthesis.warnings.push(warn);
            }

  }

}
