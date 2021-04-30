import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { MusicTrackService } from '../services/music-track.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage {
  playlistArray = [];
  playlist = "";
  
  constructor(
    private musicTrackService : MusicTrackService,
    private chnageDetector : ChangeDetectorRef,
    private alertController : AlertController
  ) { }

  ionViewWillEnter(){
    this.getPlaylist();
  }
  
  ionViewDidEnter(){

  }

  ionViewWillLeave(){

  }

  ionViewDidLeave(){

  }

  async getPlaylist(){
    this.playlistArray= await this.musicTrackService.getPlaylist();
    this.playlist="";
    this.chnageDetector.detectChanges();
  }

  async addNewPlaylist(playlistName : string){
    await this.musicTrackService.addNewPlaylist(playlistName);
    this.getPlaylist();
  }

  async deletePlaylist(playlistObj:Playlist){
    console.log("count", playlistObj.count);
    if(playlistObj.count > 1){
      const alert = await this.alertController.create({
        header: 'Warning',
        message: `Are you sure to delete ${playlistObj.name} having ${playlistObj.count} songs?`,
        buttons: [
          {
              text: 'DELETE',
              cssClass : "alert-btn-danger",
              handler: async() => {
                await this.musicTrackService.deletePlaylist(playlistObj);
              }
          },{
              text: 'CANCEL',
              cssClass : "primary",
              handler: async() => {
                
              }
          },
        ]
      });
      alert.present();
    }else{
      await this.musicTrackService.deletePlaylist(playlistObj);
    }
    this.getPlaylist();
  }

}
