
import { Injectable } from '@angular/core';

@Injectable()
export class Server
{
    /*message:String;
    static instance:Server;
    static isCreating:Boolean = false;*/
    meetings: Object[];
    static milis: number;
 
    constructor() {
        this.meetings = [];
        Server.milis = 1000*60*60*24*365;
        for(let i = 0; i < 20; i++){
            this.meetings.push(Server.generateMeeting());
        }
    }

    getMeetings(){
        return  new Promise((resolve, reject) => resolve(this.meetings));         
    }

    static generateMeeting(){
        let now = new Date();
        now = new Date(now.getTime() + Math.random()*this.milis);
        return {
            time: now,
            title: Server.getTitle(), 
            participants: Server.getParticipants()
        };
    }

    static getTitle(){
        switch (Math.ceil(Math.random()*4))
        {
            case 1:
                return 'Playing D&D';
            case 2:
                return 'Gym';
            case 3:
                return 'Go to ballete';
            case 4:
                return 'Stay home';
        }
    }

    static getParticipants(){
        let pool = ['shy', 'omer', 'eran', 'sasha', 'michael', 'kaspi'];
        let result = [];
        let count = Math.ceil(Math.random()*6);
        for(let i = 0; i < count; i++){
            let index = Math.floor(Math.random()*pool.length);
            result.push(pool[index]);
            pool.splice(index, 1);
        }
        return result;
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