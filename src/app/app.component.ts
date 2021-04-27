import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private platform : Platform
  ) {

    this.initializeApp();
  }

  ionViewWillEnter(){
    if(this.platform.is("hybrid")){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  initializeApp(){
    this.platform.ready().then(() => {
        const crashlytics = this.firebaseCrashlytics.initialise();
        crashlytics.logException('my caught exception');
     });
  
  }

}
