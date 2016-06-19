
import { Injectable } from '@angular/core';

@Injectable()
export class Server
{
    /*message:String;
    static instance:Server;
    static isCreating:Boolean = false;*/
 
    constructor() {

    }

    getMeetings(){
        return ['Shy', 'Vrigar', 'Karl', 'alon'];
    }
 
 /*
    static getInstance() {
        if (Server.instance == null) {
            Server.isCreating = true;
            Server.instance = new Server();
            Server.isCreating = false;
        }
 
        return Server.instance;
    }
    

 
    setMessage(message:String) {
        this.message = message;
    }
 
    getMessage() {
        return this.message;
    }
    */
}