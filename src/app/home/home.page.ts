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



import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(public http : HttpClient) { }

  sendRequest(videoId : any){
    const httpOptions = {
      headers: new HttpHeaders({
        })
      };
      var body=`url=https://www.youtube.com/watch?v=${videoId}&q_auto=1&ajax=1`;

      this.http.post("https://www.y2mate.com/mates/analyze/ajax",body, httpOptions)
      .subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
      });
      
  }
}

