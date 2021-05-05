import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlertController, IonInput } from '@ionic/angular';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';
import { ActionSheetController } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../util/constants';
import { PopoverController } from '@ionic/angular';
import { ActionMenuComponent } from '../action-menu/action-menu.component';


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
  isPlayerPlayingTrack : boolean = false;

  @ViewChild("inputSearch",{static:false})inputSearch:IonInput;
  
  constructor(
    private musicTrackService : MusicTrackService,
    private alertController : AlertController,
    private changeDetector : ChangeDetectorRef,
    private actionSheetController: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private popoverController: PopoverController,

  ) { 
    this.musicTrackService.isPlayerPlayingBehaviourSubject.subscribe((isPlaying)=>{
      this.isPlayerPlayingTrack=isPlaying;
    })
  }

  ionViewWillEnter(){
    this.musicTrackService.musicTrackAddedBehaviourSubject.subscribe((isNewMusicTrackAdded)=>{
      if(isNewMusicTrackAdded){
        this.getMusicArray();
      }
    })
    this.activatedRoute.params.subscribe(params=>{
      if(params && params.playlistName){
        this.activePlaylist=params.playlistName;
      }
      this.getMusicArray();
    });
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){

  }

  async getMusicArray(){
    let musicArray= await this.musicTrackService.getAllLocalTracks();
    let lastTrackPlayed:MusicTrack;

    let lastTrackPlayedPath=await this.musicTrackService.getLastPlayedTrack();

    if(this.activePlaylist==Constants.STRING_EMPTY_STRING){
      this.musicArray=musicArray;
      this.activePlaylistName=Constants.STRING_WORD_ALL;
      musicArray.forEach((musicTrack:MusicTrack)=>{
        if(musicTrack.path==lastTrackPlayedPath){
          lastTrackPlayed=musicTrack;
        }
      });
    }else if(this.activePlaylist==Constants.STRING_PLAYLIST_FAV){
      let musicInPlaylistArray=[];
      musicArray.forEach((musicTrack:MusicTrack)=>{
        if(musicTrack.isFavourite){
          musicInPlaylistArray.push(musicTrack);
        }
        if(musicTrack.path==lastTrackPlayedPath){
          lastTrackPlayed=musicTrack;
        }
      });
      this.musicArray=musicInPlaylistArray;
      this.activePlaylistName=Constants.STRING_WORD_FAVOURITE;
    }else{
      let musicInPlaylistArray=[];
      musicArray.forEach((musicTrack:MusicTrack)=>{
        if(musicTrack.playlist.indexOf(this.activePlaylist)!=-1){
          musicInPlaylistArray.push(musicTrack);
        }
        if(musicTrack.path==lastTrackPlayedPath){
          lastTrackPlayed=musicTrack;
        }
      });
      this.musicArray=musicInPlaylistArray;
      this.activePlaylistName = this.activePlaylist;
    }
    this.filteredMusicArray = this.musicArray;
    if(this.musicArray.length>0 && !this.isPlayerPlayingTrack){
      if(!lastTrackPlayed){
        lastTrackPlayed=this.musicArray[0];
      }
      this.musicTrackService.playTrack(lastTrackPlayed,this.musicArray,false);
    }
  }

  async addMockMusicTrack(){
    this.musicTrackService.createMockData();
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
        this.trackInput=this.trackInput.toLowerCase();
        this.musicArray.forEach((track)=>{
          if(track.name.toLowerCase().indexOf(this.trackInput) != -1){
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

  

  deleteFormPlaylist(musicTrack:MusicTrack){
    this.musicTrackService.deleteMusictrackFromPlaylist(musicTrack, this.activePlaylistName);
    musicTrack.uiHideInList = true;
  }

  openTrackMenu(){

  }


  toggleSearchBar(){
    this.isOpen = !this.isOpen;
    if(this.isOpen){
      this.inputSearch.setFocus();
    }
  }

  playTrack(musicTrack:MusicTrack){
    this.musicTrackService.playTrack(musicTrack,this.musicArray,true);
  }

  async actionMenuPopover(ev: any, item:MusicTrack) {
    const popover = await this.popoverController.create({
      component: ActionMenuComponent,
      event: ev,
      cssClass: 'action-menu-popover',
      componentProps: {
        track : item
      },
      translucent: true
    });

    popover.onDidDismiss().then((result) => {
      if(result && result.data == "delete"){
        item.uiHideInList=true;
      }
    });

    return await popover.present();

  }
  

}


