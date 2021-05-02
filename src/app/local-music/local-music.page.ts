import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';
import { ActionSheetController } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../util/constants';


@Component({
  selector: 'app-local-music',
  templateUrl: './local-music.page.html',
  styleUrls: ['./local-music.page.scss'],
})


export class LocalMusicPage {
  public static TAG : string = "LocalMusicPage";
  musicArray : MusicTrack[]=[];
  filteredMusicArray : MusicTrack[]=[];
  trackInput : string = Constants.STRING_EMPTY_STRING;
  playlistArray : Playlist[]=[];
  activePlaylist : string = Constants.STRING_EMPTY_STRING;
  activePlaylistName : string = Constants.STRING_WORD_ALL;
  isOpen = false;
  
  constructor(
    private musicTrackService : MusicTrackService,
    private alertController : AlertController,
    private changeDetector : ChangeDetectorRef,
    private actionSheetController: ActionSheetController,
    private activatedRoute: ActivatedRoute,

  ) { }

  ionViewWillEnter(){
    this.activatedRoute.params.subscribe(params=>{
      if(params && params.playlistName){
        this.activePlaylist=params.playlistName;
      }
      this.getMusicArray();
    });
  }

  ionViewDidEnter(){
    this.getPlaylist();
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){

  }

  async getMusicArray(){
    let musicArray= await this.musicTrackService.getAllLocalTracks();
    if(this.activePlaylist==Constants.STRING_EMPTY_STRING){
      this.musicArray=musicArray;
      this.activePlaylistName=Constants.STRING_WORD_ALL;
    }else if(this.activePlaylist==Constants.STRING_PLAYLIST_FAV){
      let musicInPlaylistArray=[];
      musicArray.forEach((musicTrack:MusicTrack)=>{
        if(musicTrack.isFavourite){
          musicInPlaylistArray.push(musicTrack);
        }
      });
      this.musicArray=musicInPlaylistArray;
      this.activePlaylistName=Constants.STRING_WORD_FAVOURITE;
      console.log(this.activePlaylistName);
    }else{
      let musicInPlaylistArray=[];
      musicArray.forEach((musicTrack:MusicTrack)=>{
        if(musicTrack.playlist.indexOf(this.activePlaylist)!=-1){
          musicInPlaylistArray.push(musicTrack);
        }
      });
      this.musicArray=musicInPlaylistArray;
      this.activePlaylistName = this.activePlaylist;
    }
    this.filteredMusicArray = this.musicArray;

    //TODO:remove
    this.playTrack(this.musicArray[1]);    
  }

  async addMockMusicTrack(){
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Music Track Added.',
      buttons: [{
          text: 'OK',
          handler: () => {
            this.getMusicArray();
          }
      }]
    });

     alert.present();
  }

  searchTrack(){
      let filteredMusicArray = [];
      if(this.trackInput!=""){
        this.musicArray.forEach((track)=>{
          if(track.name.indexOf(this.trackInput) != -1){
            filteredMusicArray.push(track);
          }
        })
      }else{
        filteredMusicArray=this.musicArray;
      }
      this.filteredMusicArray = filteredMusicArray;     
      this.changeDetector.detectChanges();
  }

  async openSortMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Arrange By',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'A-Z',
        handler: () => {
          this.filteredMusicArray = MusicTrackUtil.sort(
                                      SortByMusicTrack.A_TO_Z,
                                      this.musicArray
                                    ); 
        }
      }, {
        text: 'Z-A',
        handler: () => {
          this.filteredMusicArray = MusicTrackUtil.sort(
                                      SortByMusicTrack.Z_TO_A,
                                      this.musicArray
                                    ); 
        }
      }, {
        text: 'Recent First',
        handler: () => {
          this.filteredMusicArray = MusicTrackUtil.sort(
                                      SortByMusicTrack.RECENT_FIRST,
                                      this.musicArray
                                    );
        }
      }, {
        text: 'Old First',
        handler: () => {
          this.filteredMusicArray = MusicTrackUtil.sort(
                                      SortByMusicTrack.OLD_FIRST,
                                      this.musicArray
                                    );
        }
      }, {
        text: 'Longest First',
        handler: () => {
          this.filteredMusicArray = MusicTrackUtil.sort(
                                      SortByMusicTrack.LONGEST_FIRST,
                                      this.musicArray
                                    );
        }
      }, {
          text: 'Shortest First',
          handler: () => {
            this.filteredMusicArray = MusicTrackUtil.sort(
                                        SortByMusicTrack.SHORTEST_FIRST,
                                        this.musicArray
                                      );
          }
      }]
    });
    await actionSheet.present();
    this.changeDetector.detectChanges();
  }

  toggleFavourite(musicTrack:MusicTrack){
    musicTrack.isFavourite=!musicTrack.isFavourite;
    this.musicTrackService.toggleFavourite(musicTrack.path);
  }

  async addToPlaylist(musicTrack:MusicTrack){
    let buttonConfigArray=[];
    for(let i=0;i<this.playlistArray.length;i++){
      buttonConfigArray.push({
        text:this.playlistArray[i].name,
        handler: ()=>{
          if(musicTrack.playlist.indexOf(this.playlistArray[i].name)==-1){
            this.musicTrackService.addToPlaylist(
              musicTrack,
              this.playlistArray[i].name
            )
          }
        }
      });
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Add To Playlist',
      buttons: buttonConfigArray
    });
    await actionSheet.present();
  }

  deleteFormPlaylist(musicTrack:MusicTrack){
    this.musicTrackService.deleteMusictrackFromPlaylist(musicTrack, this.activePlaylistName);
    musicTrack.uiHideInList = true;
  }

  openTrackMenu(){

  }

  async getPlaylist(){
    this.playlistArray=await this.musicTrackService.getPlaylist();
  }

  toggleSearchBar(){
    this.isOpen = !this.isOpen;
  }

  playTrack(musicTrack:MusicTrack){
    this.musicTrackService.playTrack(musicTrack,this.musicArray);
  }
  

}


