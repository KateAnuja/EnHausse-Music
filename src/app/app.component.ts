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
import { MusicTrackService } from './services/music-track.service';
import { fromEvent } from 'rxjs';


const fcm = new FCM();



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMusicPlayerReady  : boolean=false;
  isKeyboradOpen : boolean=false;
  showMusicPlayer : boolean=true;
  playerDataBehaviorSubscription;
  screenHeight:number=0;
  constructor(
    private screenOrientation: ScreenOrientation,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private platform : Platform,
    private musicTrackService : MusicTrackService,
    
  ) {
    
    let w:any=window;
    this.screenHeight=w.innerHeight;
    w.addEventListener("resize",()=>{
      let wH=window.innerHeight;
      if(wH<this.screenHeight){
        this.isKeyboradOpen=true;
      }else{
        this.isKeyboradOpen=false;
      }
      this.toggleMusicPlayer();
      
    });

    this.playerDataBehaviorSubscription=this.musicTrackService.playerDataBehaviorSubject;

    this.playerDataBehaviorSubscription.subscribe((mP)=>{
        if(mP){
          if(!this.isMusicPlayerReady){
            this.isMusicPlayerReady = true;
            this.toggleMusicPlayer();
            // this.playerDataBehaviorSubscription.unsubscribe();
          }
        }
      });
    this.initializeApp();
  }

  toggleMusicPlayer(){
    this.showMusicPlayer= this.isMusicPlayerReady && !this.isKeyboradOpen;
  }

  ionViewWillEnter(){
    // if(this.platform.is("hybrid")){
    //   this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    // }
  }

  initializeApp(){
    this.platform.ready().then(() => {
      if(this.platform.is("hybrid")){
        const crashlytics = this.firebaseCrashlytics.initialise();
        crashlytics.logException('my caught exception');
      }
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
    }).catch((err) => console.log(JSON.stringify(err)));
  
  }

  getToken(){
    fcm
    .getToken()
    .then((r) => console.log(`Token ${r.token}`))
    .catch((err) => console.log(err));
  }


  getNotification(){
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  }
  

}
