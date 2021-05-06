import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlertController, IonInput } from '@ionic/angular';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';
import { ActionSheetController } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../util/constants';
import { PopoverController } from '@ionic/angular';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { MusicPlayer } from '../model/musicPlayer';
import { ThisReceiver } from '@angular/compiler';


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
    private router:Router,

  ) { 
    this.musicTrackService.isPlayerPlayingBehaviourSubject
    .subscribe((isPlaying)=>{
      this.isPlayerPlayingTrack=isPlaying;
    })
    this.musicTrackService.playerDataBehaviorSubject
    .subscribe((mP:MusicPlayer)=>{
      if(mP){
        this.highLightPlayingTrack(mP.currentMusictTrack);
      }
    });
  }

  ionViewWillEnter(){
    this.musicTrackService.musicTrackAddedBehaviourSubject
    .subscribe((isNewMusicTrackAdded)=>{
      if(isNewMusicTrackAdded){
        this.getMusicArray();
      }
    })
    this.musicTrackService.playListUpdatedBehaviourSubject
    .subscribe((playListrUpdated)=>{
      if(playListrUpdated){
        this.getPlaylist();
      }
    })
    this.activatedRoute.params
    .subscribe(params=>{
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

  async getPlaylist(){
    this.playlistArray=await this.musicTrackService.getPlaylist();
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
    this.highLightPlayingTrack(lastTrackPlayed);
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

  async addToPlaylist(track:MusicTrack){
    let buttonConfigArray=[];
    for(let i=0;i<this.playlistArray.length;i++){
      buttonConfigArray.push({
        text:this.playlistArray[i].name,
        handler: ()=>{
          if(track.playlist.indexOf(this.playlistArray[i].name)==-1){
            this.musicTrackService.addToPlaylist(
              track,
              this.playlistArray[i].name
            )
            this.musicTrackService.playListUpdatedBehaviourSubject.next(true);
          }
        }
      });
    }
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Add To Playlist',
      cssClass: 'action-sheet-playlist',
      buttons: buttonConfigArray
    });
    await actionSheet.present();
  }

  deleteFormPlaylist(musicTrack:MusicTrack){
    musicTrack.uiHideInList = true;
    this.musicTrackService.deleteMusictrackFromPlaylist(musicTrack, this.activePlaylistName);
  }

  deleteMusicTrack(track:MusicTrack){
    this.musicTrackService.deleteMusicTrack(track);
  }

  highLightPlayingTrack(playingMusicTrack:MusicTrack){
    if(playingMusicTrack){
      let foundCurrentTrack=false;
      let foundPrevTrack=false;
      for(let i=0;i<this.filteredMusicArray.length;i++){
        if(this.filteredMusicArray[i].uiIsPlaying){
          this.filteredMusicArray[i].uiIsPlaying=false;
          foundPrevTrack=true;
        }
        if(this.filteredMusicArray[i].path==playingMusicTrack.path){
          this.filteredMusicArray[i].uiIsPlaying=true;
          foundCurrentTrack=true;
        }
        if(foundCurrentTrack && foundPrevTrack){
          break;
        }
      }
    }  
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
        if(this.activePlaylistName == Constants.STRING_WORD_ALL){
          this.deleteMusicTrack(item);
          item.uiHideInList=true;
        }else{
          this.deleteFormPlaylist(item);
        }
      }
      if(result && result.data == "add"){
        this.addToPlaylist(item);
      }
    });

    return await popover.present();

  }

  searchOnWeb(){
    this.router.navigate([`/search/web/${this.trackInput}`]);
    this.isOpen=false;
    this.trackInput="";
  }
  

}


