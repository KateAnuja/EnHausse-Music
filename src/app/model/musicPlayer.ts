import { MusicTrack } from "./track";

export interface MusicPlayer{
    currentMusictTrack : MusicTrack;
    musicTrackArray : MusicTrack[];
}


export class MusicPlayerUtil{
    private static currentMusictTrack:MusicTrack;
    private static musicTrackArray:MusicTrack[];
    private static currentIndex=0;
    private static totalDuration=0;

    public static startPlayer(musicTrack:MusicTrack,musicTrackArray:MusicTrack[]){
        this.currentMusictTrack={...musicTrack};
        this.musicTrackArray=[...musicTrackArray];
        this.totalDuration=0;
        this.musicTrackArray.forEach((mT:MusicTrack,index)=>{
            if(mT.path==this.currentMusictTrack.path){
                this.currentIndex=index;
            }
            this.totalDuration+=mT.duration;
        })
    }

    public static getTotalDuration(){
        return this.totalDuration;
    }

    public static getNext(){
        if((this.currentIndex+1)>this.musicTrackArray.length-1){
            return this.musicTrackArray[0];
        }
        return this.musicTrackArray[this.currentIndex+1];
    }

    public static getPrev(){
        if((this.currentIndex-1)<0){
            return this.musicTrackArray[this.musicTrackArray.length-1];
        }
        return this.musicTrackArray[this.currentIndex-1];
    }

    
}