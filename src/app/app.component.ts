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
import { Router } from '@angular/router';
import { Utility } from './util/utility';


const fcm = new FCM();
const { IonicPlugin } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMusicPlayerReady  : boolean=false;
  isKeyboradOpen : boolean=false;
  showMusicPlayer : boolean=false;
  playerDataBehaviorSubscription;
  screenHeight:number=0;
  constructor(
    private screenOrientation: ScreenOrientation,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private platform : Platform,
    private musicTrackService : MusicTrackService,
    private router:Router,
    
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

  initializeApp(){
    this.platform.ready().then(async () => {
      if(this.platform.is("hybrid")){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        const crashlytics = this.firebaseCrashlytics.initialise();
        crashlytics.logException('my caught exception');

        let pluginResponse=await IonicPlugin.getSharedLink();
        if(pluginResponse.sharedLink && pluginResponse.sharedLink.length>10){
          let url=pluginResponse.sharedLink;
          let vid=Utility.getVideoIdFromUrl(url);
          if(vid){
            this.router.navigate([`/search/download/${vid[1].toString()}`]);
          }
        }
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
      .catch((err) => console.error(err));
    }).catch((err) => console.error(JSON.stringify(err)));
  
  }

  getToken(){
    fcm
    .getToken()
    .then((r) => console.log(`Token ${r.token}`))
    .catch((err) => console.error(err));
  }


  getNotification(){
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  }
  

}
