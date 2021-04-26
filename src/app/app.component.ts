import { Component } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private splashScreen: SplashScreen,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private platform : Platform
  ) {

    this.initializeApp();
  }

  ionViewDidEnter(){
    this.splashScreen.hide();
  }

  initializeApp(){
    this.platform.ready().then(() => {
        const crashlytics = this.firebaseCrashlytics.initialise();
        crashlytics.logException('my caught exception');
     });
  
  }

}
