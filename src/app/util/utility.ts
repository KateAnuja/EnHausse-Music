import { Constants } from "./constants";

export class Utility{
    public static generateRandomSongName(){
        let nameLength : number = this.randomNumber(4,10);
        let songName : string = "";
        for(let i=0;i<nameLength;i++){
            
            let word = Constants.SONG_WORD_ARRAY[this.randomNumber(0,Constants.SONG_WORD_ARRAY.length)];
            while(songName.indexOf(word)!=-1){
                word = Constants.SONG_WORD_ARRAY[this.randomNumber(0,Constants.SONG_WORD_ARRAY.length)];
            }
            songName += word + " ";
        }

        return songName.trim();

    }

    public static randomNumber(min, max){
        const r = Math.random()*(max-min) + min
        return Math.floor(r)
    }
}