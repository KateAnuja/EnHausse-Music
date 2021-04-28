import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { Platform } from '@ionic/angular';
import {
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

// const { PushNotifications } = Plugins;

import { Plugins } from '@capacitor/core';
const { PushNotifications } = Plugins;

import { FCM } from '@capacitor-community/fcm';
const fcm = new FCM();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private platform : Platform,
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

     

    //  PushNotifications.requestPermission().then( result => {
    //   if (result.granted) {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     this.getToken();
    //     PushNotifications.register();
    //   } else {
    //     // Show some error
    //   }
    // });

    PushNotifications.register()
    .then(() => {
      this.getToken();
    //
    // Subscribe to a specific topic
    // you can use `FCMPlugin` or just `fcm`
    fcm
      .subscribeTo({ topic: 'DAILY_MUSIC_DOSE' })
      .then((r) => {
      })
      .catch((err) => console.log(err));
    }).catch((err) => alert(JSON.stringify(err)));
  
  }

  getToken(){
    fcm
    .getToken()
    .then((r) => alert(`Token ${r.token}`))
    .catch((err) => console.log(err));
  }


  getNotification(){
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );
  }
}
