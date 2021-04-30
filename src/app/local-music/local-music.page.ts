import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';


@Component({
  selector: 'app-local-music',
  templateUrl: './local-music.page.html',
  styleUrls: ['./local-music.page.scss'],
})


export class LocalMusicPage {
  musicArray : MusicTrack[]=[];
  filteredMusicArray : MusicTrack[]=[];
  trackInput : string = "";
  constructor(
    private musicTrackService : MusicTrackService,
    private alertController : AlertController,
    private changeDetector : ChangeDetectorRef,
  ) { }

  ionViewWillEnter(){
    this.getMusicArray();
  }

  ionViewDidEnter(){

  }

  ionViewWillLeave(){

  }

  ionViewDidLeave(){

  }

  async getMusicArray(){
    this.musicArray= await this.musicTrackService.getAllLocalTracks();
    this.filteredMusicArray = this.musicArray;
  }

  async addMockMusicTrack(){
    this.musicTrackService.createMockData();
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Music Track Added.',
      buttons: ['OK']
    });

     alert.present();
  }

  searchTrack(){
     let filteredMusicArray = [];
     this.musicArray.forEach((track)=>{
      if(track.name.indexOf(this.trackInput) != -1){
        filteredMusicArray.push(track);
      }
     })
     this.filteredMusicArray = filteredMusicArray;
     this.changeDetector.detectChanges();
  }

}
