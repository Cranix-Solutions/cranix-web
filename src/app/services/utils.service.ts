import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';


@Injectable()
export class UtilsService {

        public okBrowser: boolean = true;
        public actMdList;
        constructor() {
                let tmp = window.navigator.userAgent
                if (tmp.indexOf("Mozilla") != -1 && tmp.indexOf("Windows") != -1) {
                        this.okBrowser = false;
                }
        }

        public hostName(): string {
                var hostname = window.location.hostname;
                var protocol = window.location.protocol;
                var port = window.location.port;
                var url = '';
                if (sessionStorage.getItem('shortName')) {
                        if (port) {
                                url = `${protocol}//${hostname}:${port}/${sessionStorage.getItem('shortName')}`
                        } else {
                                url = `${protocol}//${hostname}/${sessionStorage.getItem('shortName')}`
                        }
                } else if (port) {
                        url = protocol + "//" + hostname + ":" + port + "/api";
                }
                else {
                        url = protocol + "//" + hostname + "/api";
                }
                //console.log("From utils: " + url);
                //return "https://admin.cephalix.eu/api"
                //return "https://remscheid.cephalix.eu/api"
                //return "https://admin.schulzentrum-kirchberg.at/api"
                return "https://192.168.122.100:444/api"
                return "https://192.168.178.91:1444/api"
                return url;
        }
        public log(args) {
                var dev = isDevMode();
                //console.log(dev);
                if (dev) {
                        console.log(args);
                }
        }

        public deleteCookie(name) {
                this.setCookie(name, '', -1);
        }

        /**
         * get cookie
         * @param {string} name
         * @returns {string}
         */
        public getCookie(name: string) {
                const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
                const caLen: number = ca.length;
                const cookieName = `${name}=`;
                let c: string;

                for (let i = 0; i < caLen; i += 1) {
                        c = ca[i].replace(/^\s+/g, '');
                        if (c.indexOf(cookieName) === 0) {
                                return c.substring(cookieName.length, c.length);
                        }
                }
                return '';
        }

        /**
         * set cookie
         * @param {string} name
         * @param {string} value
         * @param {number} expireHours
         * @param {string} path
         */
        public setCookie(name: string, value: string, expireHours: number, path: string = '') {
                const d: Date = new Date();
                d.setTime(d.getTime() + expireHours * 60 * 60 * 1000);
                const expires = `expires=${d.toUTCString()}`;
                const cpath = path ? `; path=${path}` : '';
                document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
        }
}

