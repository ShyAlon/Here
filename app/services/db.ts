import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Participant, Phone, Meeting} from '../common/meeting'

@Injectable()
export class DB {
    static storage: Storage;

    constructor() {
        DB.storage = new Storage(SqlStorage);
        this.createMeetingTable()
        .then(()=>this.createParticipantsTable)
        .then(()=>this.createParticipantMeetingsTable)
        .then(()=>this.createItemTable);
        // .then(() => console.log(' DB Initialized'))
    }

    createMeetingTable(){
        return this.createTable('meetings', 'title TEXT, timestamp INTEGER');
    }

    createParticipantsTable(){
        return this.createTable('participants', 'pid TEXT NOT NULL UNIQUE');
    }

    createParticipantMeetingsTable(){
        return this.createTable('participantMeetings', 'participant INTEGER, meeting INTEGER');
    }

    createItemTable(){
        return this.createTable('items', 'text TEXT, participantMeeting INTEGER');
    }

    createTable(name, columns){
        return DB.storage.query('CREATE TABLE IF NOT EXISTS ' + name + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, ' + columns + ')').then((data) => {
            // console.log("TABLE CREATED -> " + JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error.err));
        });
    }

    insert(table, fieldArray, valueArray){
        let fields = fieldArray.join();
        let values = valueArray.join();
        let query = "INSERT INTO " + table + " (" + fields + ") VALUES ( " + values + " )";
        console.log('Insert', query);
        DB.storage.query(query).then((data) => {
            // console.log(JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR", error);
        });
    }

    select(table, fieldArray, getObject, where = ''){
        let str = "SELECT * FROM " + table + where;
        return DB.storage.query(str).then((data) => {
                let result = [];
                //console.log("DB::Select Success", data);
                if(data.res.rows.length > 0) {
                    for(let i = 0; i < data.res.rows.length; i++) {
                        let obj = getObject();
                        for(let j = 0; j < fieldArray.length; j++){
                            obj[fieldArray[j]] = data.res.rows.item(i)[fieldArray[j]];
                            //console.log('field', fieldArray[j] + ' ' + data.res.rows.item(i)[fieldArray[j]]);
                        }
                        //result.push({firstname: data.res.rows.item(i).firstname, lastname: data.res.rows.item(i).lastname});
                        result.push(obj);
                    }
                }
                // console.log(data.res.rows);
                // console.log(result);
                console.log("DB::Select Success", str);
                return result;
            }, (error) => {
                console.log("DB::Select ERROR", str);
                console.log("DB::Select ERROR", JSON.stringify(error));
            });
    }
}