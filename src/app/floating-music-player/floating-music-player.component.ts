import { Component, OnInit } from '@angular/core';
import { MusicPlayer, MusicPlayerOrderPreference, MusicPlayerUtil } from '../model/musicPlayer';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';

@Component({
  selector: 'app-floating-music-player',
  templateUrl: './floating-music-player.component.html',
  styleUrls: ['./floating-music-player.component.scss'],
})
export class FloatingMusicPlayerComponent implements OnInit {

  currentMusicTrack:MusicTrack;
  musicTrackArray:MusicTrack[]=[];
  nextMusicTrack:MusicTrack;
  prevMusicTrack:MusicTrack;
  totalDurationOfPlaylist:number=0;
  isPlaying : boolean =false;
  orderPreference = MusicPlayerOrderPreference;


  
  constructor(
    private musicTrackService:MusicTrackService,
  ) { 
    this.musicTrackService.playerDataBehaviorSubject.subscribe((mP:MusicPlayer)=>{
      if(mP){
        this.currentMusicTrack=mP.currentMusictTrack;
        this.musicTrackArray=mP.musicTrackArray;
        MusicPlayerUtil.startPlayer(
                              mP.currentMusictTrack,
                              mP.musicTrackArray, 
                              mP.orderPreference
                        );
        this.nextMusicTrack=MusicPlayerUtil.getNext();
        this.prevMusicTrack=MusicPlayerUtil.getPrev();
        this.totalDurationOfPlaylist=MusicPlayerUtil.getTotalDuration();
      }
    })
  }

  ngOnInit() {
    
  }

  prev(){
    this.musicTrackService.playTrack(this.prevMusicTrack,this.musicTrackArray);
  }

  next(){
    this.musicTrackService.playTrack(this.nextMusicTrack,this.musicTrackArray);
  }

  togglePlayer(pause){
    this.isPlaying=!this.isPlaying;
  }

  setOrderPreference(orderPreference : MusicPlayerOrderPreference){
    let adjacentTrackObj=this.musicTrackService.setMusicOrderPreference(orderPreference);
    this.prevMusicTrack=adjacentTrackObj.prevTrack;
    this.nextMusicTrack=adjacentTrackObj.nextTrack;
  }

}
