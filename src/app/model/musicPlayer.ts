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

    
}