import { Component } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService, private platform: Platform) {
	  
	  this.platform.ready().then(() => {
		this.data.getData().then((result) => {
			this.messages = result["data"];
		});
    });
	  
  }

public messages = null;

  refresh(ev) {
	
	this.data.getData().then((result) => {
		console.log('get data async on refresh loaded');
		ev.detail.complete();
		this.messages = result["data"];
	});

  }

}
