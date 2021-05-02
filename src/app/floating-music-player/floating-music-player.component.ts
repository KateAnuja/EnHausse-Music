import { Component, OnInit } from '@angular/core';
import { MusicPlayer } from '../model/musicPlayer';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';

@Component({
  selector: 'app-floating-music-player',
  templateUrl: './floating-music-player.component.html',
  styleUrls: ['./floating-music-player.component.scss'],
})
export class FloatingMusicPlayerComponent implements OnInit {

  currentMusicTrack:MusicTrack;
  
  constructor(
    private musicTrackService:MusicTrackService,
  ) { 
    this.musicTrackService.playerDataBehaviorSubject.subscribe((mP:MusicPlayer)=>{
      if(mP){
        this.currentMusicTrack=mP.currentMusictTrack;
      }
    })
  }

  ngOnInit() {
    
  }

}
