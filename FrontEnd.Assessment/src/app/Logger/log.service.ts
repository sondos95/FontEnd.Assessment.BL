import { Injectable } from '@angular/core';
import { Logger } from './Logger';
import { environment } from 'src/environments/environment';
import { LogModel } from './Log.Model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logger: Logger;

  constructor() {}

  public initialize() {
    this.logger = new Logger(environment.appName, environment.logapiUrl);
  }

  public logHttpInfo(info: any, timeStamp: string) {
    // TODO: create and set correlation id
    const url = location.href;
    const logFields: LogModel = {
      environment: environment.env,
      message:info,
      level:1,
      fileName:url,
      timeStamp:timeStamp
    };

    this.logger.log('Information', `${info}`, logFields);
  }

  public logError(errorMsg: string) {
    const url = location.href;

    const logFields: LogModel = {
      environment: environment.env,
      message:errorMsg,
      level:4,
      fileName:url,
      timeStamp:new Date().getDate().toString()
    };

    this.logger.log('Error', errorMsg, logFields);
  }

  public logInfo(info: any) {
    const url = location.href;
    const logFields: LogModel = {
      environment: environment.env,
      message:info,
      level:1,
      fileName:url,
      timeStamp:new Date().getDate().toString()
    };


    this.logger.log('Information', info, logFields);
  }
}