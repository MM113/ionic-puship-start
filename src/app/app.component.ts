import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

declare var Puship;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
	private push: Push,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
	  

	  this.push.hasPermission()
	  .then((res: any) => {

		if (res.isEnabled) {
		  console.log('We have permission to send push notifications');
		} else {
		  console.log('We do not have permission to send push notifications');
		}

	  });
	  
	// Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
	this.push.createChannel({
	 id: "testchannel1",
	 description: "My first test channel",
	 // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
	 importance: 3,
	 //badge is used to if badge appears on the app icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
	 //false = no badge on app icon.
	 //true = badge on app icon
	 badge: false
	}).then(() => console.log('Channel created'));

	// Delete a channel (Android O and above)
	this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

	// Return a list of currently configured channels
	this.push.listChannels().then((channels) => console.log('List of channels', channels))

	// to initialize push notifications

	const options: PushOptions = {
	   android: {
		   clearBadge: true
	   },
	   ios: {
		   alert: 'true',
		   badge: true,
		   sound: 'false'
	   },
	   windows: {},
	   browser: {
		   pushServiceURL: 'http://push.api.phonegap.com/v1/push'
	   }
	}

	const pushObject: PushObject = this.push.init(options);

	pushObject.on('notification').subscribe((notification: any) => 
			{
				alert('Received a notification:' + JSON.stringify(notification));
				
			}
		);

	pushObject.on('registration').subscribe((registration: any) =>
		{ 
			console.log('Device registered: ', registration);
			
			//Puship.EnableLog(true);
			Puship.Register(
					registration.registrationId,
					'5oG4g6iXs3P2NHe',
					{
						successCallback: function (pushipresult) {
							alert("device registered with DeviceId:" + pushipresult.DeviceId());
						},
						failCallback: function (pushipresult) {
							alert("error during registration: " + JSON.stringify(pushipresult));
						}
					}
				);
		});

	pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
	  
    });
  }
}
