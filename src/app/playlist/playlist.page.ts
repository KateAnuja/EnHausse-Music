import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { MusicTrackService } from '../services/music-track.service';
import { Router } from '@angular/router';
import { Constants } from '../util/constants';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage {
  playlistArray = [];
  playlist = Constants.STRING_EMPTY_STRING;
  favouritesCount =0;
  favPlaylistString=Constants.STRING_PLAYLIST_FAV;
  
  constructor(
    private router : Router,
    private musicTrackService : MusicTrackService,
    private chnageDetector : ChangeDetectorRef,
    private alertController : AlertController,
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
    this.playlist=Constants.STRING_EMPTY_STRING;
    this.favouritesCount=await this.musicTrackService.getFavCount();
    this.chnageDetector.detectChanges();
  }

  async addNewPlaylist(playlistName : string){
    await this.musicTrackService.addNewPlaylist(playlistName);
    this.getPlaylist();
  }

  async deletePlaylist(playlistObj:Playlist){
    if(playlistObj.count > 1){
      const alert = await this.alertController.create({
        header: 'Warning',
        message: `Are you sure to delete 
                  ${playlistObj.name} 
                  having ${playlistObj.count} songs?`
                  .replace(/\n/gi,'').replace(/\t/gi,''),
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

  openPlaylist(playlistName:string){
    this.router.navigate([`/local-music/${playlistName}`])
  }

}
