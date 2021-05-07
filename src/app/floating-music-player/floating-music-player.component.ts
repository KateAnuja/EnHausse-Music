import { Component, ViewChild } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { IonRange } from '@ionic/angular';
import { 
  MusicPlayer, 
  MusicPlayerOrderPreference, 
  MusicPlayerUtil 
} from '../model/musicPlayer';
import { MusicTrack } from '../model/track';
import { MusicTrackService } from '../services/music-track.service';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Component({
  selector: 'app-floating-music-player',
  templateUrl: './floating-music-player.component.html',
  styleUrls: ['./floating-music-player.component.scss'],
})
export class FloatingMusicPlayerComponent {

  @ViewChild('trackRange',{static:false})trackRange:IonRange;

  currentMusicTrack:MusicTrack;
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
    private musicControls: MusicControls,
  ) { 
    this.musicTrackService.playerDataBehaviorSubject
      .subscribe(this.initMusicPlayer.bind(this));
    this.controllerListner();
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
      if(mP.toPlay){
        this.playTrack();
      }
      
      this.audioProgressBarInterval=setInterval(async ()=>{
        this.audioFile.getCurrentPosition().then((pos)=>{
          this.currentMusicPlayingDuration = pos*1000;
          if(this.currentMusicPlayingDuration<0){
            this.currentMusicPlayingDuration=0;
          }
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

  playTrack(){
    this.audioFile.play();
    this.musicTrackService.isPlayerPlayingBehaviourSubject.next(true);
    this.isPlaying=true;
    this.musicTrackService.isPlayerPlayingBehaviourSubject.next(true);
    this.musicTrackService.saveLastPlayedTrack(this.currentMusicTrack);

    this.musicControls.create({
      track       : this.currentMusicTrack.name,
      cover       : this.currentMusicTrack.thumbnail,
      isPlaying   : true,
      hasPrev   : true,
      hasNext   : true,
    
    
      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker    : this.currentMusicTrack.name,
      // All icons default to their built-in android equivalents
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
     });
    
  }
  pauseTrack(){
    this.isPlaying=false;
    this.audioFile.pause();
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
      this.pauseTrack();
    }else{
      this.playTrack();
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

  controllerListner(){
    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;
      switch(message) {
                case 'music-controls-next':
                    this.next();
                    break;
                case 'music-controls-previous':
                    this.prev();
                    break;
                case 'music-controls-pause':
                    this.pauseTrack();
                    break;
                case 'music-controls-play':
                    this.playTrack();
                    break;
                case 'music-controls-seek-to':
                  const seekToInSeconds = JSON.parse(action).position;
                  this.musicControls.updateElapsed({
                    elapsed: seekToInSeconds,
                    isPlaying: true
                  });
                    // Do something
                  break;
                // Headset events (Android only)
                // All media button events are listed below
                case 'music-controls-media-button' :
                    this.next();
                    break;
                case 'music-controls-headset-unplugged':
                    this.pauseTrack();
                    break;
                case 'music-controls-headset-plugged':
                    this.playTrack();
                    break;
                default:
                    break;
      } 
    });
   
    this.musicControls.listen();
    this.musicControls.updateIsPlaying(true);
  }

}
