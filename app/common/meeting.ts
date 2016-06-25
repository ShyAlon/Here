import {DB} from '../services/db'

export class ItemBase {
  public id: Number;
  constructor(){
    
  }

  insert(db: DB){
    throw "You should never inset an item";
  }

  insertCallback(data){
    console.log(data);
    if(this){
      this.id = data.res.insertId;
    } else {
      console.log('Shit');
    }
  }

  static quote(str){
    return "'" + str + "'";
  }
}

export class Meeting extends ItemBase  {
  constructor(private time: Date, private title: String, private participants: Participant[], public scheduled: Boolean) {
    super();
  }

  insert(db: DB){
    db.insert('meetings', ['title', 'timestamp'], [Item.quote(this.title), this.time.getTime()], this)
  }

  static select(db: DB){
    return db.select('meetings', ['id', 'title', 'timestamp'], function boo () {
      return new Meeting(new Date(), '', [], false);
    });
  }
}

export class MeetingParticipant extends ItemBase  {
  constructor(public meeting: Number = 0,  public participant: Number = 0, public importance: Number = 0) {
    super();
  }

  insert(db: DB){
    return db.insert('meetingParticipants', ['participant', 'meeting', 'importance'], [this.participant, this.meeting, this.importance], this);
  }

  update(db: DB){
    // UPDATE COMPANY SET ADDRESS = 'Texas' WHERE ID = 6;
    return db.update('meetingParticipants', ['participant', 'meeting', 'importance'], [this.participant, this.meeting, this.importance], this);
  }

  static select(db: DB, meetingId: Number, participantId: Number = 0){
    let where =' where meeting = ' + meetingId;
    if(participantId){
      where = where + ' and participant = ' + participantId;
    }
    return db.select('meetingParticipants', ['id', 'participant', 'meeting', 'importance'], function boo () {
      return new MeetingParticipant();
    }, where);
  }
}

export class Item extends ItemBase  {
  constructor(public text: String = '',  public participantMeeting: Number = 0) {
    super();
  }

  insert(db: DB){
    return db.insert('items', ['text', 'meetingParticipant'], [Item.quote(this.text), this.participantMeeting], this).then((data) => this.insertCallback(data));
  }

  delete(db: DB){
    return db.delete('items', this).then((data)=> console.log('Deleted', data));
  }

  static select(db: DB, meetingParticipantId: Number){
    let where =' where meetingParticipant = ' + meetingParticipantId;
    return db.select('items', ['id', 'text', 'meetingParticipant'], function boo () {
      return new Item();
    }, where);
  }
}


export class Phone {
  constructor(public mobile: String,public home: String, public office: String) {
  }
}

export class Participant extends ItemBase {
  items: Item[];
  participantMeeting: MeetingParticipant;
  constructor(public id=0, public pid: String ='', public name : String='', public email: String='', public address: String='', public gender: String='', public phone: Phone=null){
    super();
  }

  insert(db: DB){
    db.insert('participants', ['pid'], [Item.quote(this.pid)], this);
  }

  static selectIn(db: DB, meetingParticipants: MeetingParticipant[]){
    if(!meetingParticipants || meetingParticipants.length == 0){
      return new Promise((resolve, reject) => resolve([]));
    }

    let where =' where id in (';
    for(let i = 0; i < meetingParticipants.length; i++){
      // console.log(meetingParticipants[i]);
      where = where + meetingParticipants[i].participant;
      if( meetingParticipants.length - i > 1){
        where = where + ',';
      } else {
        where = where + ')';
      }
    }
    
    return db.select('participants', ['pid'], function boo () {
      return new Participant();
    }, where);
  }
}