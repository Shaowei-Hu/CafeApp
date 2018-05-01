import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'jhi-album',
  templateUrl: './album.component.html',
  styleUrls: [
    'album.scss'
  ]
})
export class AlbumComponent implements OnInit {

  message: string;

  constructor() {
    this.message = 'AlbumComponent message';
  }

  ngOnInit() {
  }

}
