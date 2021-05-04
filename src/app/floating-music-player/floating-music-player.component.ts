import { Component, ViewChild } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { IonRange, Platform } from '@ionic/angular';
import { 
  MusicPlayer, 
  MusicPlayerOrderPreference, 
  MusicPlayerUtil 
} from '../model/musicPlayer';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';

@Component({
  selector: 'app-floating-music-player',
  templateUrl: './floating-music-player.component.html',
  styleUrls: ['./floating-music-player.component.scss'],
})
export class FloatingMusicPlayerComponent {

  @ViewChild('trackRange',{static:false})trackRange:IonRange;

  currentMusicTrack:MusicTrack={
    name: "abc", 
    duration : 0, 
    path : "", 
    isFavourite : false,
    playlist : [],
    thumbnail : "",
    addedTimeStamp : +new Date()};
  musicTrackArray:MusicTrack[]=[];
  nextMusicTrack:MusicTrack;
  prevMusicTrack:MusicTrack;
  totalDurationOfPlaylist:number=0;
  isPlaying : boolean = false;
  orderPreferenceRef = MusicPlayerOrderPreference;
  orderPreference : MusicPlayerOrderPreference= MusicPlayerOrderPreference.ALL_IN_LOOP;
  audioFile : MediaObject;
  audioProgressBarInterval=null;
  audioDuration=-1;
  isSeekBarFocused=false;
  currentMusicPlayingDuration = 0;

  
  constructor(
    private musicTrackService:MusicTrackService,
    private media : Media,
    private platform : Platform,
  ) { 
    this.musicTrackService.playerDataBehaviorSubject
      .subscribe(this.initMusicPlayer.bind(this));
  }

  OnSeekTrackFocus(){
    this.isSeekBarFocused=true;
  }

  initMusicPlayer(mP:MusicPlayer){
    if(mP){
      this.audioDuration=-1;
      this.currentMusicPlayingDuration = 0;
      if(this.audioProgressBarInterval){
        clearInterval(this.audioProgressBarInterval);
      }
      this.currentMusicTrack=mP.currentMusictTrack;
      this.musicTrackArray=mP.musicTrackArray;
      this.orderPreference=mP.orderPreference;
      MusicPlayerUtil.startPlayer(
                            mP.currentMusictTrack,
                            mP.musicTrackArray, 
                            mP.orderPreference
                      );
      this.nextMusicTrack=MusicPlayerUtil.getNext();
      this.prevMusicTrack=MusicPlayerUtil.getPrev();
      this.totalDurationOfPlaylist=MusicPlayerUtil.getTotalDuration();
      if(this.audioFile){
        this.audioFile.stop();
      }
      this.audioFile = this.media.create(
        this.currentMusicTrack.path.replace(/^file:\/\//,'')
      );
      console.log("mP.toPlay",mP.toPlay);
      if(mP.toPlay){
        this.audioFile.play();
        this.isPlaying=true;
      }
      
      this.audioProgressBarInterval=setInterval(async ()=>{
        this.audioFile.getCurrentPosition().then((pos)=>{
          this.currentMusicPlayingDuration = pos*1000;
          if(!this.isSeekBarFocused){
            if(this.audioDuration<0){
              this.audioDuration=this.audioFile.getDuration()*1000;
            }
            this.trackRange.value=(pos*1000*100/this.audioDuration)
            if(Number(this.trackRange.value)==100 || Number(this.trackRange.value)<0){
              this.currentMusicPlayingDuration = 0;
              this.next();
            }
          }
        })
      },200);
    }
  }

  prev(){
    this.audioFile.stop();
    this.musicTrackService.playTrack(this.prevMusicTrack,this.musicTrackArray,true);
  }

  next(){
    this.audioFile.stop();
    this.musicTrackService.playTrack(this.nextMusicTrack,this.musicTrackArray,true);
  }

  togglePlayer(){
    this.isPlaying=!this.isPlaying;
    if(!this.isPlaying){
      this.audioFile.pause();
    }else{
      this.audioFile.play();
    }
  }

  setOrderPreference(orderPreference : MusicPlayerOrderPreference){
    this.orderPreference=orderPreference;
    let adjacentTrackObj=this.musicTrackService
                          .setMusicOrderPreference(orderPreference);
    
    this.prevMusicTrack=adjacentTrackObj.prevTrack;
    this.nextMusicTrack=adjacentTrackObj.nextTrack;
  }

  seekTrackTo(){
    let duration=this.audioDuration;
    let seekToVal=1;
    if(Number(this.trackRange.value)){
      seekToVal=duration*(Number(this.trackRange.value)/100)
    }
    this.audioFile.seekTo(seekToVal);
    this.isSeekBarFocused=false;
  }

}
