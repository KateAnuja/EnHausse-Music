import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import { Playlist } from '../model/playlist';
import { MusicTrackService } from '../services/music-track.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})
export class ActionMenuComponent implements OnInit {
  track;
  playlistArray: Playlist[]=[];
  constructor(
    private popoverController: PopoverController,
    private musicTrackService : MusicTrackService,
    private actionSheetController: ActionSheetController,
  ) { }

  ngOnInit(){
    // console.log("in action menu",this.track);
    this.getPlaylist();
  }

  async getPlaylist(){
    this.playlistArray=await this.musicTrackService.getPlaylist();
  }

  async addToPlaylist(){
      let buttonConfigArray=[];
      for(let i=0;i<this.playlistArray.length;i++){
        buttonConfigArray.push({
          text:this.playlistArray[i].name,
          handler: ()=>{
            if(this.track.playlist.indexOf(this.playlistArray[i].name)==-1){
              this.musicTrackService.addToPlaylist(
                this.track,
                this.playlistArray[i].name
              )
            }
          }
        });
      }
      console.log("buttonConfigArray", buttonConfigArray);
      const actionSheet = await this.actionSheetController.create({
        header: 'Add To Playlist',
        cssClass: 'action-sheet-playlist',
        buttons: buttonConfigArray
      });
      await actionSheet.present();
  
    this.popoverController.dismiss();
  }


  onDelete(){
    this.popoverController.dismiss();
  }

  dismissPopover(){
    this.popoverController.dismiss();
  }



}
