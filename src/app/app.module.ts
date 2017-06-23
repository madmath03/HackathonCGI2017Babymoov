import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';

// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { DistributorsPage } from '../pages/distributors/distributors';
import { ProductsPage } from '../pages/products/products';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ProductLookupPage } from '../pages/product-lookup/product-lookup';
import { SynthesisPage } from '../pages/synthesis/synthesis';

import { AuthService } from '../providers/auth-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    DistributorsPage,
    ProductsPage,
    ProductDetailPage,
    ProductLookupPage,
    SynthesisPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    DistributorsPage,
    ProductsPage,
    ProductDetailPage,
    ProductLookupPage,
    SynthesisPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    BarcodeScanner,
    Geolocation,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
