
import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import {Participant, Phone, Meeting, MeetingParticipant, Item} from '../common/meeting'
import {DB} from './db'

@Injectable()
export class Server {
    /*message:String;
    static instance:Server;
    static isCreating:Boolean = false;*/
    meetings: Meeting[];
    pool: Participant[];
    storage: Storage;
    static milis: number;
    static items: Meeting[];
    // Whether we run in simulation 
    static simulation: Boolean;

    constructor(public db: DB) {
        this.meetings = [];
        this.pool = Server.getPool();
        Server.milis = 1000 * 60 * 60 * 24 * 365;
        Server.simulation = true;
    }


    getperson(id) {
        return new Promise((resolve, reject) => this.getPersonImpl(resolve, reject, id));
    }

    getMeetingParticipant(participantId, meetingId) {
        return MeetingParticipant.select(this.db, meetingId, participantId);
    }

    getItems(meetingParticipantId) {
        return Item.select(this.db, meetingParticipantId);
    }


    private getPersonImpl(resolve, reject, id) {
        let found = false;
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].id == id) {
                let contact = Server.sanitizeContact(this.pool[i])
                console.log(contact.items.length);
                resolve(contact);
                found = true;

                break;
            }
        }
        if (!found) {
            reject(Error("No matching person with id" + id));
        }
    }

    getMeetings() {
        return Meeting.select(this.db);
    }

    // Get the participant ids and then populate the participants
    getMeetingParticipants(meetingId: Number) {
        return MeetingParticipant.select(this.db, meetingId).then((meetingParticipants: MeetingParticipant[]) => {
            if (!meetingParticipants || meetingParticipants.length == 0) {
                return new Promise((resolve, reject) => resolve([]));
            }
            let result = new Array<Participant>();
            for (let i = 0; i < meetingParticipants.length; i++) {
                let mp = meetingParticipants[i];
                //console.log(mp);
                for (let i = 0; i < this.pool.length; i++) {
                    //console.log(this.pool[i]);
                    if (this.pool[i].pid == mp.pid) {
                        let contact = Server.sanitizeContact(this.pool[i])
                        result.push(contact);
                        break;
                    }
                }
            }
            return new Promise((resolve, reject) => resolve(result));
            
        }, (error) => { console.log(error); });
    }

    getContact(pid) {
        this.pool = this.pool || Server.getPool();
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].pid == pid) {
                return this.pool[i];
            }
        }
        return null;
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

    static getPool() {
        return [
            new Participant(1, "c200", "Ravi Tamada", "ravi@gmail.com", "xx-xx-xxxx,x - street, x - country", "male",
                new Phone("+91 0000000000", "00 000000", "00 000000")),



            new Participant(2, "c201",
                "Johnny Depp",
                "johnny_depp@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(3, "c202",
                "Leonardo Dicaprio",
                "leonardo_dicaprio@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(4, "c203",
                "John Wayne",
                "john_wayne@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000"))
            , new Participant(5, "c204",
                "Angelina Jolie",
                "angelina_jolie@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "female",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(5, "c205",
                "Dido",
                "dido@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "female",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(6, "c206",
                "Adele",
                "adele@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "female",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(7, "c207",
                "Hugh Jackman",
                "hugh_jackman@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(8, "c208",
                "Will Smith",
                "will_smith@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(9, "c209",
                "Clint Eastwood",
                "clint_eastwood@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(10, "c2010",
                "Barack Obama",
                "barack_obama@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(11, "c2011",
                "Kate Winslet",
                "kate_winslet@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "female",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000")),
            new Participant(12, "c2012",
                "Eminem",
                "eminem@gmail.com",
                "xx-xx-xxxx,x - street, x - country",
                "male",
                new Phone(
                    "+91 0000000000",
                    "00 000000",
                    "00 000000"
                ))
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
            result.push({ name: contact.name, id: contact.id });
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