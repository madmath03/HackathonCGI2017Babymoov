import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';

import { DistributorsPage } from '../distributors/distributors';

import { AuthService } from '../../providers/auth-service';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loading: Loading;
  private registerCredentials = { email: '', password: '' };

  constructor(private nav: NavController, 
    private _auth: AuthService, 
    private _alertCtrl: AlertController, 
    private _loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public login() {
    this.showLoading();
    this._auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.nav.setRoot(DistributorsPage);
      } else {
        this.showError('Accès refusé');
      }
    },
      error => {
        this.showError(error);
      });
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
    this._loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this._loading.present();
    */
  }

  showError(text) {
    //this._loading.dismiss();

    let alert = this._alertCtrl.create({
      title: 'Echec',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
