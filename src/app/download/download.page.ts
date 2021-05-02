import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { IonRange } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-downlaod',
  templateUrl: 'download.page.html',
  styleUrls: ['download.page.scss'],
})
export class DownloadPage {
 
  
  
  
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HTTP,
    private changeDetector : ChangeDetectorRef,
    private platform: Platform,
  ) {
    
  }



  

  ionViewDidEnter(){
    
  }

  

  

  
  

  openSearch(){
    this.router.navigate(['search']);
  }

}
