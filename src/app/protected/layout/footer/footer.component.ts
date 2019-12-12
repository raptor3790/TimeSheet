import { Component, OnInit } from '@angular/core';
import {Config} from '../../../core/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  name: string;

  constructor() { }

  ngOnInit() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    this.name = `${Config.APP_NAME} ${year}`;
  }

}
