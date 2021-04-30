import { Component, OnInit, ViewChild } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { IonRange } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';


export interface Track{
  name : string;
  path : string;
}


@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
})
export class MusicPlayerPage implements OnInit {
  playlist : Track[]=[];
  activeTrack : Track = null;
  isPlaying = false;
  progress :number = 0;
  audioFile : MediaObject = null;
  @ViewChild('range', {static : false}) range : IonRange;

  constructor(
    private file: File,
    private media : Media,
  ) { }

  ngOnInit() {
    this.getFileList();
  }

  async getFileList(){
    let dirs=await this.file.listDir(this.file.externalCacheDirectory,"Music");
    dirs.forEach((dir)=>{
      if(dir.isFile && dir.fullPath.indexOf(".mp3")!=-1){
        this.playlist.push({
          name:dir.fullPath.substring(
            dir.fullPath.lastIndexOf("/")+1,
            dir.fullPath.lastIndexOf(".mp3")
          ).replace(/-/gi,' '),
          path:dir.nativeURL
        });
      }
    });
    console.log("playlist....", this.playlist[1].name);
  }

  start(track : Track){
    if(this.audioFile){
      this.audioFile.stop();
    }
    this.audioFile = this.media.create(track.path.replace(/^file:\/\//,''));
    this.audioFile.play();
    this.activeTrack=track;
    this.isPlaying=true;
    
    this.updateProgress();

  }

  togglePlayer(pause){
    this.isPlaying = !pause;
    if(pause){
      this.audioFile.pause();
      this.isPlaying = false;
    }else{
      this.audioFile.play(); 
      this.isPlaying = true;
    }

  }

  next(){
    let index= this.playlist.indexOf(this.activeTrack);
    if(index != this.playlist.length-1){
      this.start(this.playlist[index+1])
    }else{
      this.start(this.playlist[0]);
    }
  }

  prev(){
    let index= this.playlist.indexOf(this.activeTrack);
    if(index>0){
      this.start(this.playlist[index-1])
    }else{
      this.start(this.playlist[this.playlist.length-1]);
    }

  }

  seek(){
    let newValue= +this.range.value;
    let duration= this.audioFile.getDuration();
    this.audioFile.seekTo(duration * (newValue/100));

  }

  async updateProgress(){
    let seek= await this.audioFile.getCurrentPosition();
    this.progress = ( seek / this.audioFile.getDuration()) * 100 || 0;
    setTimeout(()=>{
      this.updateProgress()
    }, 1000);
  }

}
