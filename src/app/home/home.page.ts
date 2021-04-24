import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const {IonicPlugin} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url : string="https://www.youtube.com/watch?v=mt9xg0mmt28";
  constructor() {}


  ionViewDidEnter(){
    this.verifyUrl();
  }

  async verifyUrl(){
    let videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null){
      console.log("video id = ",videoid[1]);
      let downloadUrl=await IonicPlugin.scrapY2Mate({
        "videoId":videoid[1].toString()
      });
      console.log("downloadUrl",downloadUrl);
    }else{ 
      //TODO: add alert for non youtube url 
      console.log("The youtube url is not valid.");
    }
  }

}
