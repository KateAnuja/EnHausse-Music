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
  ) { 
    
  }

  ngOnInit(){
  
  }

  addToPlaylist(){
    this.popoverController.dismiss("add");
  }


  async deleteMusicTrack(){
    this.popoverController.dismiss("delete");
  }

  dismissPopover(){
    this.popoverController.dismiss();
  }



}
