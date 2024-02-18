import { Subject, debounceTime, filter } from "rxjs";
import { LogModel } from "./Log.Model";

export type LogType = 'Error' | 'Information';

interface LogEntry {
  type: LogType;
  data: LogModel;
}

enum LoggerEvents {
  Flush = 1
}

export class Logger {
  private readonly LEVEL = 'Level';
  private readonly LINENUMBER = 'LineNumber';
  private readonly TIMESTAMMP = 'TimeStamp';
  private readonly MESSAGE = 'Message';
  private readonly FILENAME = 'FileName';
  private readonly ENVIRONMENT ="Environment";
  private buffer: LogEntry[] = [];
  private flush = new Subject<LoggerEvents>();

  constructor(private appName: string, private logEndpoint: string) {
    this.flush
      .pipe(debounceTime(5000), filter((event) => event === LoggerEvents.Flush))
      .subscribe(() => this.flushBuffer());
  }

  public log(type: LogType, message: string, data: LogModel) {
    this.buffer.push({
      type,
      data
    });
    this.flush.next(LoggerEvents.Flush);
  }

  private flushBuffer() {
    const data = this.buffer.splice(0);

    if (data.length === 0) {
      return;
    }

    const body = data
      .map((entry) => this.buildLogString(entry))
      .reduce((sum, entry) => (sum += entry), '');

      const xobj = new XMLHttpRequest();
      // tslint:disable-next-line:no-console
      xobj.onerror = (err) => console.error(err);
      xobj.open('POST', this.logEndpoint, true);
      xobj.send(body);
    
  }

  private buildLogString(entry: LogEntry): string {
    const index = this.buildIndexChunk();
    const body = this.buildBodyChunk(entry);

    return `${index}\n${body}\n`;
  }

  private buildIndexChunk() {
    const date = new Date();
    const index = {
      index: {
        _index: `logstash-${date.toString()}`,
        _type: 'logevent'
      }
    };

    return JSON.stringify(index);
  }

  private buildBodyChunk(entry: LogEntry) {
    const { type, data } = entry;
    const level = type;
    const date = new Date();
    const messageTemplate = this.getMessageTemplate();
    const fields = this.getFields(data);
    const body = {
      '@timestamp': `${date.toISOString()}`,
      level,
      messageTemplate,
      fields
    };

    return JSON.stringify(body);
  }

  private getMessageTemplate() {
    const fields: string[] = [
       this.FILENAME,
       this.LEVEL,
       this.LINENUMBER,
       this.MESSAGE,
       this.TIMESTAMMP,
       this.ENVIRONMENT
    ];
    const template = fields.map((field) => `{${field}}`).join(' - ');

    return template;
  }

  private getFields(data: LogModel) {
    return {
      [this.LEVEL]: data.level,
      [this.TIMESTAMMP]: data.timeStamp,
      [this.FILENAME]: data.fileName,
      [this.MESSAGE]: data.message,
      [this.ENVIRONMENT]:data.environment
    };
  }
}