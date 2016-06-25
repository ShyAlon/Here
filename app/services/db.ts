import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Participant, Phone, Meeting, ItemBase} from '../common/meeting'

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
        return this.createTable('meetingParticipants', 'participant INTEGER, meeting INTEGER, importance INTEGER');
    }

    createItemTable(){
        return this.createTable('items', 'text TEXT, meetingParticipant INTEGER');
    }

    createTable(name, columns){
        return DB.storage.query('CREATE TABLE IF NOT EXISTS ' + name + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, ' + columns + ')').then((data) => {
            // console.log("TABLE CREATED -> " + JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error.err));
        });
    }

    insert(table, fieldArray, valueArray, item: ItemBase){
        let fields = fieldArray.join();
        let values = valueArray.join();
        let query = "INSERT INTO " + table + " (" + fields + ") VALUES ( " + values + " )";
        console.log('Insert', query);
        return DB.storage.query(query);
    }
    //  UPDATE COMPANY SET ADDRESS = 'Texas' WHERE ID = 6;

    update(table, fieldArray, valueArray, item: ItemBase){
        let fields = fieldArray.join();
        let values = valueArray.join();
        let query = "UPDATE " + table + " set ";
        for (let i = 0; i < fieldArray.length; i++){
            query = query + fieldArray[i] + ' = ' + valueArray[i] + (i == fieldArray.length -1 ?  ' ' : ', ');
        }
        query = query + ' where id = ' + item.id;
        console.log('update', query);
        return DB.storage.query(query);
    }

    delete(table, item: ItemBase){
        let query = "DELETE FROM " + table + " WHERE ID = " + item.id;
        console.log('Delete', query);
        return DB.storage.query(query);
    }

    select(table, fieldArray, getObject, where = ''){
        let str = "SELECT * FROM " + table + where;
        console.log(str);
        
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
                //console.log(data.res.rows);
                //console.log(result);
                console.log("DB::Select Success", str);
                return result;
            }, (error) => {
                console.log("DB::Select ERROR", str);
                console.log("DB::Select ERROR", error);
            });
    }
}