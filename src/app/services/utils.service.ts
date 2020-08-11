import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';


@Injectable()
export class UtilsService {

        public hostName(): string{
                var hostname = window.location.hostname;
                var protocol = window.location.protocol;
                var port = window.location.port;
                var url = '';
                if (sessionStorage.getItem('shortName')){
                        if(port){
                                url = `${protocol}//${hostname}:${port}/${sessionStorage.getItem('shortName')}`
                        }else {
                                url = `${protocol}//${hostname}/${sessionStorage.getItem('shortName')}`
                        }
                } else if (port) {
                        url = protocol + "//" + hostname + ":" + port + "/api";
                }
                else{
                        url = protocol + "//" + hostname + "/api";
		}
		//Test only
                url = 'https://test-cephalix.cephalix.eu/api';
		//url = 'https://repo.cephalix.eu/api';
                //url = 'https://gif1.bbs1-gifhorn.de:444/api';
		//url = 'https://172.18.0.2/api';
                //url = 'https://10.0.0.2:443/api';
                //url = 'https://fs-zinnowitz.cranix.eu/api';
                //url = 'https://pcs.dnsuser.de:10444/api';
                //url = 'https://192.168.2.80:444/api';
                //url = 'https://192.168.2.81:444/api';
                //console.log("From utils: " + url);
                return url ;
        }
        public log(args) {
                var dev = isDevMode();
                //console.log(dev);
                if (dev) {
                        console.log(args);
                }
        }
}

