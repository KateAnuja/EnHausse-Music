import { Utility } from "../util/utility";
import { MusicTrack } from "./track";

export interface MusicPlayer{
    currentMusictTrack : MusicTrack;
    musicTrackArray : MusicTrack[];
    orderPreference : MusicPlayerOrderPreference;
}

export enum MusicPlayerOrderPreference{
    ALL_IN_LOOP = "All in loop",
    ONE_IN_LOOP = "One in loop",
    SHUFFLE = "Shuffle"
}

export class MusicPlayerUtil{
    private static currentMusictTrack:MusicTrack;
    private static musicTrackArray:MusicTrack[];
    private static currentIndex=0;
    private static totalDuration=0;
    private static _orderPreference=MusicPlayerOrderPreference.ALL_IN_LOOP;

    public static startPlayer(musicTrack:MusicTrack,musicTrackArray:MusicTrack[],orderPreference:MusicPlayerOrderPreference){
        this.currentMusictTrack={...musicTrack};
        this.musicTrackArray=[...musicTrackArray];
        this._orderPreference=orderPreference;
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
        if(this._orderPreference == MusicPlayerOrderPreference.ALL_IN_LOOP){
            if((this.currentIndex+1)>this.musicTrackArray.length-1){
                return this.musicTrackArray[0];
            }
            return this.musicTrackArray[this.currentIndex+1];
        }else if(this._orderPreference == MusicPlayerOrderPreference.ONE_IN_LOOP){
            return this.currentMusictTrack;
        }else if(this._orderPreference == MusicPlayerOrderPreference.SHUFFLE){
            return this.musicTrackArray[Utility.randomNumber(0,this.musicTrackArray.length-1)];
        }
        
    }

    public static getPrev(){
        if(this._orderPreference == MusicPlayerOrderPreference.ALL_IN_LOOP){
            if((this.currentIndex-1)<0){
                return this.musicTrackArray[this.musicTrackArray.length-1];
            }
            return this.musicTrackArray[this.currentIndex-1];
        }else if(this._orderPreference == MusicPlayerOrderPreference.ONE_IN_LOOP){
            return this.currentMusictTrack;
        }else if(this._orderPreference == MusicPlayerOrderPreference.SHUFFLE){
            return this.musicTrackArray[Utility.randomNumber(0,this.musicTrackArray.length-1)];
        }
        
    }

    public static setOrderPreference(orderPreference : MusicPlayerOrderPreference){

        this._orderPreference = orderPreference;
        return {
            nextTrack : this.getNext(),
            prevTrack : this.getPrev()
        }

    }



    
}