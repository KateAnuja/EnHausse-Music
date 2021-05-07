import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInput, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-popover',
  templateUrl: './playlist-popover.component.html',
  styleUrls: ['./playlist-popover.component.scss'],
})
export class PlaylistPopoverComponent implements OnInit {
  @ViewChild("playlistInput",{static:false}) playlistInput:ElementRef;

  constructor(
    private popoverController : PopoverController,
  ) { }

  ngOnInit() {}
  ngAfterViewInit(){
    setTimeout(()=>{
      this.playlistInput.nativeElement.focus();
    },500);
  }

  addPlaylist(){
    this.popoverController.dismiss(this.playlistInput.nativeElement.value);
  }


}
