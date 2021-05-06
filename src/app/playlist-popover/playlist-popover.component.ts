import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';

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
    this.playlistInput.nativeElement.setFocus();
  }

  addPlaylist(){
    console.log(this.playlistInput.nativeElement.value);
    this.popoverController.dismiss(this.playlistInput.nativeElement.value);
  }


}
