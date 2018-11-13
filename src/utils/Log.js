/* @flow */
/* global stream$Writable, tty$WriteStream, $npm$chalk$StyleElement */
// $FlowIssue: console is node native module
import { Console } from 'console';
import chalk from 'chalk';
import ansiStyles from 'ansi-styles';
import { eraseLine, cursorTo } from 'ansi-escapes';

export function info(msg: string): string {
  return eraseLine + cursorTo(0) + chalk.gray(msg);
}

type Stream = stream$Writable | tty$WriteStream;

type AnsiStyleElement = {
  open: string,
  close: string,
};

export default class Log {
  console: Console;
  name: string;
  stream: Stream;
  colors: {
    info: AnsiStyleElement,
    error: AnsiStyleElement,
    warn: AnsiStyleElement,
  };

  constructor(name: string, stream?: Stream = process.stderr) {
    this.name = name;
    this.stream = stream;
    this.console = new Console(stream);
    this.colors = {
      info: ansiStyles.gray,
      error: ansiStyles.red,
      warn: ansiStyles.yellow,
    };
  }

  _color(msg: string): string {
    return `${this.colors.info.open}${msg}${this.colors.info.close}`;
  }

  _msg(str: string, prependName?: boolean = true): string {
    return prependName ? `${chalk.bold(`[${this.name}]`)} ${str}` : str;
  }

  clearLine() {
    this.stream.write(eraseLine + cursorTo(0));
  }

  info(msg: string, prependName?: boolean) {
    this.stream.write(this.colors.info.open);
    this.console.log(this._msg(msg, prependName));
    this.stream.write(this.colors.info.close);
  }

  warn(msg: string | Error, prependName?: boolean = true) {
    this.stream.write(this.colors.warn.open);
    if (prependName) {
      this.write('', true);
    }
    this.console.warn(msg);
    this.stream.write(this.colors.warn.close);
  }

  error(msg: string | Error, prependName?: boolean = true) {
    this.stream.write(this.colors.error.open);
    if (prependName) {
      this.write('', true);
    }
    this.console.error(msg);
    this.stream.write(this.colors.error.close);
  }

  write(msg: string, prependName?: boolean) {
    this.stream.write(this._msg(msg, prependName));
  }

  time(key: string) {
    this.console.time(key);
  }

  timeEnd(key: string, prependName?: boolean = true) {
    this.stream.write(this.colors.info.open);
    if (prependName) {
      this.write('', true);
    }
    this.console.timeEnd(key);
    this.stream.write(this.colors.info.close);
  }
}
