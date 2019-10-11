import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'jhi-key',
  templateUrl: './key.component.html',
  styleUrls: [
    'key.component.scss'
  ]
})
export class KeyComponent implements OnInit {

  message: string;

  constructor() {
    this.message = 'KeyComponent message';
  }

  ngOnInit() {
  }

}
