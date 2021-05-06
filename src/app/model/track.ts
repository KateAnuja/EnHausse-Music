export interface MusicTrack{
    name : string;
    duration : number;
    path : string;
    thumbnail : string;
    playlist : string[];
    isFavourite : boolean;
    addedTimeStamp : number;
    uiHideInList? : boolean;
    uiIsPlaying? : boolean;
}

export enum SortByMusicTrack{
    A_TO_Z = "A-Z",
    Z_TO_A = "Z-A",
    RECENT_FIRST = "Recent First",
    OLD_FIRST = "Old First",
    LONGEST_FIRST = "Longest First",
    SHORTEST_FIRST = "Shortest First"

}

export class MusicTrackUtil{
    public static sort(sortBy : SortByMusicTrack, musicArray : MusicTrack[]): MusicTrack[]{
        let compareFn;
        switch(sortBy){
            case SortByMusicTrack.A_TO_Z:{
                compareFn=this.sortByAToZ;
                break;
            };
            case SortByMusicTrack.Z_TO_A:{
                compareFn=this.sortByZToA;
                break;
            };
            case SortByMusicTrack.RECENT_FIRST:{
                compareFn=this.sortByRecentFirst;
                break;
            };
            case SortByMusicTrack.OLD_FIRST:{
                compareFn=this.sortByOldFirst;
                break;
            };
            case SortByMusicTrack.LONGEST_FIRST:{
                compareFn=this.sortByLongestFirst;
                break;
            };
            case SortByMusicTrack.SHORTEST_FIRST:{
                compareFn=this.sortByShortestFirst;
                break;
            };
            default:{
                compareFn=this.sortByAToZ;
            }
        }
        return [...musicArray.sort(compareFn)];
    }

    private static sortByAToZ(a:MusicTrack,b:MusicTrack):number{
        if(a.name>b.name){
            return 1;
        }
        return -1;
    }
    private static sortByZToA(a:MusicTrack,b:MusicTrack):number{
        if(a.name<b.name){
            return 1;
        }
        return -1;
    }
    private static sortByRecentFirst(a:MusicTrack,b:MusicTrack):number{
        if(a.addedTimeStamp<b.addedTimeStamp){
            return 1;
        }
        return -1;
    }
    private static sortByOldFirst(a:MusicTrack,b:MusicTrack):number{
        if(a.addedTimeStamp>b.addedTimeStamp){
            return 1;
        }
        return -1;
    }
    private static sortByLongestFirst(a:MusicTrack,b:MusicTrack):number{
        if(a.duration<b.duration){
            return 1;
        }
        return -1;
    }
    private static sortByShortestFirst(a:MusicTrack,b:MusicTrack):number{
        if(a.duration>b.duration){
            return 1;
        }
        return -1;
    }
}