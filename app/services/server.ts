
import { Injectable } from '@angular/core';
import {Meeting} from '../common/meeting';
import {Storage, SqlStorage} from 'ionic-angular';

@Injectable()
export class Server {
    /*message:String;
    static instance:Server;
    static isCreating:Boolean = false;*/
    meetings: Meeting[];
    pool: Object[];
    storage: Storage;
    static milis: number;

    constructor() {
        this.storage = new Storage(SqlStorage, {name: 'hereDb'});

        this.meetings = [];
        this.pool = Server.getPool();
        Server.milis = 1000 * 60 * 60 * 24 * 365;
        for (let i = 0; i < 20; i++) {
            this.meetings.push(Server.generateMeeting());
        }
    }


    getperson(id) {
        return new Promise((resolve, reject) => this.getPersonImpl(resolve, reject, id));
    }

    private getPersonImpl(resolve, reject, id){
        let found = false;
        for(let i = 0; i < this.pool.length; i++){
            if(this.pool[i].id == id){
                let contact = Server.sanitizeContact(this.pool[i])
                console.log(contact.items.length);
                resolve(contact);
                found = true;
                
                break;
            }
        }
        if(!found){
            reject(Error("No matching person with id" + id));
        }
    }

    getMeetings() {
        return new Promise((resolve, reject) => resolve(this.meetings));
    }

    static generateMeeting() {
        let now = new Date();
        now = new Date(now.getTime() + Math.random() * this.milis);
        return {
            time: now,
            title: Server.getTitle(),
            participants: Server.getParticipants(),
            scheduled: Math.random() > 0.5
        };
    }

    static getTitle() {
        switch (Math.ceil(Math.random() * 4)) {
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

    static getPool(){
        return  [
            {
                "id": "c200",
                "name": "Ravi Tamada",
                "email": "ravi@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c201",
                "name": "Johnny Depp",
                "email": "johnny_depp@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c202",
                "name": "Leonardo Dicaprio",
                "email": "leonardo_dicaprio@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c203",
                "name": "John Wayne",
                "email": "john_wayne@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c204",
                "name": "Angelina Jolie",
                "email": "angelina_jolie@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "female",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c205",
                "name": "Dido",
                "email": "dido@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "female",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c206",
                "name": "Adele",
                "email": "adele@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "female",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c207",
                "name": "Hugh Jackman",
                "email": "hugh_jackman@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c208",
                "name": "Will Smith",
                "email": "will_smith@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c209",
                "name": "Clint Eastwood",
                "email": "clint_eastwood@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c2010",
                "name": "Barack Obama",
                "email": "barack_obama@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c2011",
                "name": "Kate Winslet",
                "email": "kate_winslet@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "female",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            },
            {
                "id": "c2012",
                "name": "Eminem",
                "email": "eminem@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            }
        ];
    }

    // Get only name and id for each participant
    static getParticipants() {
        //let pool = ['shy', 'omer', 'eran', 'sasha', 'michael', 'kaspi'];
        let pool = Server.getPool();
        let result = [];
        let count = Math.ceil(Math.random() * 6);
        for (let i = 0; i < count; i++) {
            let index = Math.floor(Math.random() * pool.length);
            let contact = Server.sanitizeContact(pool[index]);
            result.push({name: contact.name, id: contact.id});
            pool.splice(index, 1);
        }
        return result;
    }

    static sanitizeContact(contact) {
        contact.items = contact.items || [];
        return contact;
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