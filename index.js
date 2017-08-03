#!/usr/bin/env node
/**
 *  @license
 *    Copyright 2017 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';
const docker        = require('./bin/docker');
const version       = require('./package.json').version;

process.on('unhandledRejection', e => {
    console.error(e.stack);
    process.exit(1);
});
/*
const title = 'WABS Starter v' + version;
const titleBar = (function() {
    const length = title.length + 10;
    let str = '';
    while (str.length < length) str += '/';
    return str;
})();
const titleSpacer = '//' + titleBar.substr(0, titleBar.length - 4).replace(/\//g, ' ') + '//';

console.log('\n' + titleBar);
console.log(titleSpacer);
console.log('//   ' + title + '   //');
console.log(titleSpacer);
console.log(titleBar + '\n');*/
console.log(' ');

const args = (function getCliArgs() {
    const args = Array.prototype.slice.call(process.argv, 2);
    const length = args.length;
    const result = {
        command: '',
        args: []
    };
    let key = '';

    for (let i = 0; i < length; i++) {
        const arg = args[i];
        if (arg[0] === '-') {
            key = arg.replace(/^-+/, '');
            result[key] = true;
        } else if (key) {
            result[key] = arg;
            key = '';
        } else if (i === 0) {
            result.command = arg;
        } else {
            result.args = args.slice(i);
            break;
        }
    }

    return result;
})();
const command = args.command || 'help';

switch (command) {
    case 'path':
        console.log(process.env.PATH);
        console.log(require('child_process').execSync('which docker').toString());
        break;
    case 'bash':
    case 'run':
    case 'start':
    case 'test':
        docker[command](args);
        break;
    case 'manage':
        require('./bin/ui-main');
        break;
    case 'help':
        console.log('Usage:  wabs [COMMAND]' +
            '\n\nA tool for managing local development for WABS full stack single page applications' +
            '\n\nCommands:' +
            '\n  bash      Start the docker container in an interactive bash terminal' +
            '\n  help      Output this help message' +
            '\n  manage    Start the WABS application management tool' +
            '\n  run       Within docker container execute npm run' +
            '\n  start     Within docker container execute npm start' +
            '\n  test      Within docker container execute npm test' +
            '\n\nRun \'wabs COMMAND --help\' for more information on one of these commands.' +
            '\n\nAny other command will execute within the docker container as a bash command in development mode; ' +
            'initialize with -P or --prod to run the command in production mode. ' +
            'For example you could try this command: wabs npm install');
        break;
    default:
        docker.exec(process.argv.slice(2).join(' '));
        break;
}