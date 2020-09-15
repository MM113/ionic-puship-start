import { Injectable } from '@angular/core';

export interface Message {
  id: string;
  message: string;
  date: string;
  sentToAPNS: boolean;
  sentToBPNS: boolean;
  sentToGCM: boolean;
  sentToMPNS: boolean;
  read: boolean;
  param1: string;
  param2: string;
  param3: string;
  param4: string;
  param5: string;
}

declare var Puship;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public pushLoaded = null;
  
  constructor() { }



  public getData(){
	  return new Promise(resolve => {
		    Puship.PushipAppId('5oG4g6iXs3P2NHe');
			Puship.GetPushMessages(
				{
				//limit: 10, //max limit is 50 default is 20
				//offset: 100,
				includeParams: true,
				byCurrentPosition: false,
				successCallback: this.createDelegate(function (regresult){
					console.log("GetPushMessages done");
					
					this.pushLoaded = regresult.map(item => {

						const container= {} as Message;
						container.id = item.PushMessageId;
						container.message = item.Message;
						container.date = item.Date.replace('/Date(', '').replace(')/', '');
						container.read = false;
						container.sentToAPNS = item.SentToAPNS;
						container.sentToBPNS = item.SentToBPNS;
						container.sentToGCM = item.SentToGCM;
						container.sentToMPNS = item.SentToMPNS;
						container.param1 = item.Params.Param1;
						container.param2 = item.Params.Param2;
						container.param3 = item.Params.Param3;
						container.param4 = item.Params.Param4;
						container.param5 = item.Params.Param5;

						return container;
					});
					resolve({result: true, data: this.pushLoaded});
					
				},this),
				failCallback: function (regresult){
					alert("error during GetPushMessages: " + regresult);
					resolve({result: false, data: null});
				}
			});
		});
  }
  
  private createDelegate(func, target) {
    return function() { 
        return func.apply(target, arguments);
    };
  }

  public getMessages(): Message[] {

    return this.pushLoaded;
  }

  public getMessageById(id: string): Message {
	console.log("pushLoaded by ID: " +id);
	var result = this.pushLoaded.filter(obj => {
	  return obj.id === id
	})[0];
	result.read = true;
    return result;
  }
}
