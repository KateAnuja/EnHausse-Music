import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { IonInput } from '@ionic/angular';
import { Constants } from '../util/constants';

interface SearchData{
  title:string,
  videoId:string,
  thumbnail:string,
  duration:string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild("searchInput",{static:false})searchInput:IonInput;
  bufferClipBoard:string="";
  suggestionArray:string[]=[];
  searchResultArray:SearchData[]=[];

  constructor(
    private router: Router,
    private http: HTTP,
    private changeDetector:ChangeDetectorRef,

  ) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.searchInput.setFocus();
  }

  searchTerm(){
    let termString:string=(this.searchInput.value+"").trim();
    this.suggestionArray=[];
  
    if(termString.length>0 && termString!=this.bufferClipBoard){
      this.getSuggestion(termString);
    }
  }

  getSuggestion(term:string){
    this.bufferClipBoard="";
    this.http.get(
      "https://suggestqueries-clients6.youtube.com/complete/search",
      {
        client:"youtube-reduced",
        q:`song ${term}`
      },
      {

      }
    )
    .then((res)=>{
      try{
        let data=res.data+"";
        if(data.length>0 && data.indexOf("window.google.ac.h")!=-1){
          data=data.replace(/window.google.ac.h\(/gi,'').replace(/\)/gi,'');
          let sugArr=JSON.parse(data)[1];
          sugArr.forEach(sugEl => {
            this.suggestionArray.push(sugEl[0].replace(/song /g,''))
          });
          this.changeDetector.detectChanges();
          
        }else{
          console.error("wrong res");
        }
      }catch(err){
        console.error(err)
      }
      
    })
  }

  getSearchResults(term:string){
    this.suggestionArray=[];
    this.searchResultArray=[];
    this.bufferClipBoard=term;
    this.searchInput.value=term;
    let clienVersion="";
    let currentDate=new Date();
    clienVersion+=currentDate.getFullYear()
    let month=currentDate.getMonth()+1;
    if(month<10){
      clienVersion+="0"+month;
    }else{
      clienVersion+=month;
    }
    let date=currentDate.getDate();
    if(date<10){
      clienVersion+="0"+date;
    }else{
      clienVersion+=date;
    }

    this.http.get(
      "https://m.youtube.com/results",
      {
        search_query:`song ${term}`,
        pbj:'1'
      },
      {
        "x-youtube-client-name":"2",
        "x-youtube-client-version":`2.${clienVersion}`,
        "user-agent":Constants.USER_AGENT
      }
    ).then((res)=>{
      try{
        let data=JSON.parse(res.data);
        let videoArr=data.response
        .contents.sectionListRenderer
        .contents[0].itemSectionRenderer.contents;
        videoArr.forEach(videoEl => {
          let title="",thumbnail="",videoId="",duration="";
          try{
            title=videoEl.compactVideoRenderer.title.runs[0].text;
            thumbnail=videoEl.compactVideoRenderer.thumbnail.thumbnails[0].url;
            videoId=videoEl.compactVideoRenderer.videoId;
            duration=videoEl.compactVideoRenderer.lengthText
            .accessibility.accessibilityData.label;
          }catch(err){}
          if(title.length>0 && videoId!=""){
            this.searchResultArray.push({
              title,
              thumbnail,
              videoId,
              duration
            })
          }
        });
        this.changeDetector.detectChanges();
      }catch(err){

      }
    }).catch((err)=>{
      console.error(err)
    });
  }

  downloadVideo(videoId:string){
    this.searchResultArray=[];
    this.router.navigate(['home'], {queryParams:{videoId}});
  }
}
