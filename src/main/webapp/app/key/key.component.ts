import {Component, OnInit} from '@angular/core';
import {KeyService} from './key.service';

@Component({
  selector: 'jhi-key',
  templateUrl: './key.component.html',
  styleUrls: [
    'key.component.scss'
  ]
})
export class KeyComponent implements OnInit {

  message: string;
  key: string;

  constructor(private keyService: KeyService) {
    this.message = 'KeyComponent message';
  }

  ngOnInit() {
  }

  updateKey() {
    this.keyService.setKey(this.key);
    this.key = '';
  }

}
