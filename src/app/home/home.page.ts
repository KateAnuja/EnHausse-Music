import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { LocalMusicPage } from '../local-music/local-music.page';
import { PlaylistPage } from '../playlist/playlist.page';
import { SearchPage } from '../search/search.page';
import { MusicTrackService } from '../services/music-track.service';
import { Router } from '@angular/router';


const { IonicPlugin,SplashScreen } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  localMusicPage = LocalMusicPage;
  playListPage = PlaylistPage;
  searchPage = SearchPage;
  
  isExitAlertBoxOpen = false;

  constructor(
    private platform: Platform,
    private location : Location,
    private alert : AlertController,
    private musicTrackService : MusicTrackService,
    private router : Router,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if(this.location.isCurrentPathEqualTo('/home')){
        this.showExitConfirm();
      }else{
        this.location.back();
      }
    });
  }

  showExitConfirm() {
    if (!this.isExitAlertBoxOpen) {
        this.isExitAlertBoxOpen = true;
        this.alert
            .create({
                header: "Close App?",
                message: "Do you want to close the app?",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Stay",
                        role: "cancel",
                        handler: () => {
                            console.log("Application exit prevented!");
                            this.isExitAlertBoxOpen = false;
                        },
                    },
                    {
                        text: "Exit",
                        handler: () => {
                            navigator["app"].exitApp();
                        },
                    },
                ],
            })
            .then((alert) => {
                alert.present();
            });
    }
  }

  async ionViewWillEnter(){
    let count = await this.musicTrackService.getAllLocalTracksCount();
    if(count == 0){
      this.router.navigateByUrl('search/init');
    }
  }

  ionViewDidEnter(){
    if(this.platform.is("hybrid")){
      SplashScreen.hide();
    }
  }

  OnTabChange(event){

  }


  
}
