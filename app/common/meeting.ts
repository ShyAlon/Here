import {DB} from '../services/db'

export class ItemBase {
  public id: Number;
  constructor(){
    
  }

  insert(db: DB){
    throw "You should never inset an item";
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
    db.insert('meetings', ['title', 'timestamp'], [Item.quote(this.title), this.time.getTime()])
  }

  static select(db: DB){
    return db.select('meetings', ['id', 'title', 'timestamp'], function boo () {
      return new Meeting(new Date(), '', [], false);
    });
  }
}

export class MeetingParticipant extends ItemBase  {
  constructor(public meeting: Number=0,  public participant: Number=0) {
    super();
  }

  insert(db: DB){
    db.insert('participantMeeting', ['participant', 'meeting'], [this.participant, this.meeting])
  }

  static select(db: DB, meetingId: Number, participantId: Number = 0){
    let where =' where meeting = ' + meetingId;
    if(participantId){
      where = where + ' and participant = ' + participantId;
    }
    return db.select('participantMeetings', ['id', 'participant', 'meeting'], function boo () {
      return new MeetingParticipant();
    }, where);
  }
}

export class Item extends ItemBase  {
  constructor(public text: String = '',  public participantMeeting: Number = 0) {
    super();
  }

  insert(db: DB){
    db.insert('items', ['text', 'participantMeeting'], [Item.quote(this.text), this.participantMeeting])
  }

  static select(db: DB, meetingParticipantId: Number){
    let where =' where meetingParticipant = ' + meetingParticipantId;
    return db.select('items', ['text', 'participantMeeting'], function boo () {
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
    db.insert('participants', ['pid'], [Item.quote(this.pid)]);
  }

  static selectIn(db: DB, meetingParticipants: Object[]){
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