import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MusicTrack, MusicTrackUtil, SortByMusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';
import { ActionSheetController } from '@ionic/angular';


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
    private actionSheetController: ActionSheetController,
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
  
}


