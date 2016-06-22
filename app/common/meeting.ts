import {DB} from '../services/db'

export class ItemBase {
  public id: Number;
  constructor(){
    
  }

  insert(db: DB){
    throw "You should bever inset an item";
  }

  quote(str){
    return "'" + str + "'";
  }
}

export class Meeting extends ItemBase  {
  constructor(private time: Date, private title: String, private participants: Participant[], public scheduled: Boolean) {
    super();
  }

  insert(db: DB){
    db.insert('meetings', ['title', 'timestamp'], [this.quote(this.title), this.time.getTime()])
  }

  static select(db: DB){
    return db.select('meetings', ['id', 'title', 'timestamp'], function boo () {
      return new Meeting(new Date(), '', [], false);
    });
  }
}

export class Item extends ItemBase  {
  constructor(public text: String,  public participantMeeting: Number) {
    super();
  }

  insert(db: DB){
    db.insert('items', ['text', 'participantMeeting'], [this.quote(this.text), this.participantMeeting])
  }
}


export class Phone {
  constructor(public mobile: String,public home: String, public office: String) {
  }
}

export class Participant extends ItemBase {
  items: String[];
  constructor(public id, public pid: String, public name : String, public email: String, public address: String, public gender: String, public phone: Phone){
    super();
  }

  insert(db: DB){
    return  ['participants', ['pid'], [this.pid]];
  }
}