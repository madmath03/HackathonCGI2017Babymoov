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
  private _loading: Loading;
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
    this._loading = this._loadingCtrl.create({
      content: 'Patientez...',
      dismissOnPageChange: true
    });
    this._loading.present();
  }

  showError(text) {
    this._loading.dismiss();

    let alert = this._alertCtrl.create({
      title: 'Echec',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
