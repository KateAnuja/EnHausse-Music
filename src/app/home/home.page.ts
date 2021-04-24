import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url : string="https://www.youtube.com/watch?v=mt9xg0mmt28";
  constructor() {}

  onClick(){
    console.log(this.url);
    var videoid = this.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null) {
    console.log("video id = ",videoid[1]);
    // this.networkService.sendRequest(videoid);
    } else { 
    console.log("The youtube url is not valid.");
   }
  }

}
