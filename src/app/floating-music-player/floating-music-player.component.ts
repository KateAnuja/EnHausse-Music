import { Component, OnInit } from '@angular/core';
import { MusicPlayer, MusicPlayerUtil } from '../model/musicPlayer';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';

@Component({
  selector: 'app-floating-music-player',
  templateUrl: './floating-music-player.component.html',
  styleUrls: ['./floating-music-player.component.scss'],
})
export class FloatingMusicPlayerComponent implements OnInit {

  currentMusicTrack:MusicTrack;
  nextMusicTrack:MusicTrack;
  prevMusicTrack:MusicTrack;
  totalDurationOfPlaylist:number=0;
  
  constructor(
    private musicTrackService:MusicTrackService,
  ) { 
    this.musicTrackService.playerDataBehaviorSubject.subscribe((mP:MusicPlayer)=>{
      if(mP){
        this.currentMusicTrack=mP.currentMusictTrack;
        MusicPlayerUtil.startPlayer(mP.currentMusictTrack,mP.musicTrackArray);
        this.nextMusicTrack=MusicPlayerUtil.getNext();
        this.prevMusicTrack=MusicPlayerUtil.getPrev();
        this.totalDurationOfPlaylist=MusicPlayerUtil.getTotalDuration();
      }
    })
  }

  ngOnInit() {
    
  }

}
