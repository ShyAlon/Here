import {DB} from '../services/db'

export class ItemBase {
  constructor(public id: Number = 0, public temp: Boolean = false) {

  }

  insert(db: DB) {
    throw "You should never inset an item";
  }

  insertCallback(data) {
    console.log(data);
    if (this) {
      this.id = data.res.insertId;
    } else {
      console.log('Shit');
    }
  }

  static quote(str) {
    return str ? "'" + str + "'" : "''";
  }
}

export class Meeting extends ItemBase {
  endTime: Date;
  startTime: Date;
  constructor(id: Number = 0, start: Number = (new Date()).getTime(), end: Number = (new Date()).getTime(), public title: String = '',
    public participants: Participant[] = [], public scheduled: Boolean = true, public location: String = '') {
    super(id);
    this.startTime = start ? new Date(start) : new Date();
    this.endTime = end ? new Date(end) : new Date();
  }

  insert(db: DB) {
    return db.insert('meetings', ['title', 'startTime', 'endTime', 'location'], [Item.quote(this.title), this.startTime.getTime(), this.endTime.getTime(), Item.quote(this.location)], this)
    .then((data) => {
      console.log(data.res.insertId);
      return data.res.insertId;
    });
  }

  update(db: DB) {
    return db.update('meetings', ['title', 'startTime', 'endTime', 'location'], [Item.quote(this.title), this.startTime.getTime(), this.endTime.getTime(), Item.quote(this.location)], this)
  }

  static select(db: DB) {
    return db.select('meetings', ['id', 'title', 'startTime', 'endTime', 'location'], function boo(item) {
      return new Meeting(item.id, item.startTime, item.endTime, item.title, null, true, item.location);
    });//.then((meetings) => Meeting.postDB(meetings));
  }
}



export class MeetingParticipant extends ItemBase {
  constructor(id: Number = 0, public meeting: Number = 0, public participant: Number = 0, public importance: Number = 0) {
    super(id);
  }

  insert(db: DB) {
    return db.insert('meetingParticipants', ['participant', 'meeting', 'importance'], [this.participant, this.meeting, this.importance], this);
  }

  update(db: DB) {
    // UPDATE COMPANY SET ADDRESS = 'Texas' WHERE ID = 6;
    return db.update('meetingParticipants', ['participant', 'meeting', 'importance'], [this.participant, this.meeting, this.importance], this);
  }

  static select(db: DB, meetingId: Number, participantId: Number = 0) {
    let where = ' where meeting = ' + meetingId;
    if (participantId) {
      where = where + ' and participant = ' + participantId;
    }
    return db.select('meetingParticipants', ['id', 'participant', 'meeting', 'importance'], function boo(item) {
      return new MeetingParticipant(item.id, item.meeting, item.participant, item.importance);
    }, where);
  }
}

export class Item extends ItemBase {
  constructor(id: Number = 0, public text: String = '', public participantMeeting: Number = 0) {
    super(id);
  }

  insert(db: DB) {
    return db.insert('items', ['text', 'meetingParticipant'], [Item.quote(this.text), this.participantMeeting], this).then((data) => this.insertCallback(data));
  }

  delete(db: DB) {
    return db.delete('items', this).then((data) => console.log('Deleted', data));
  }

  static select(db: DB, meetingParticipantId: Number) {
    let where = ' where meetingParticipant = ' + meetingParticipantId;
    return db.select('items', ['id', 'text', 'meetingParticipant'], function boo(item) {
      return new Item(item.id, item.text, item.participantMeeting);
    }, where);
  }
}


export class Phone {
  constructor(public mobile: String, public home: String, public office: String) {
  }
}

export class Participant extends ItemBase {
  items: Item[];
  participantMeeting: MeetingParticipant;
  constructor(id = 0, public pid: String = '', public name: String = '', public email: String = '', public address: String = '', public gender: String = '', public phone: Phone = null) {
    super(id);
  }

  insert(db: DB) {
    db.insert('participants', ['pid'], [Item.quote(this.pid)], this);
  }

  static selectIn(db: DB, meetingParticipants: MeetingParticipant[]) {
    if (!meetingParticipants || meetingParticipants.length == 0) {
      return new Promise((resolve, reject) => resolve([]));
    }

    let where = ' where id in (';
    for (let i = 0; i < meetingParticipants.length; i++) {
      // console.log(meetingParticipants[i]);
      where = where + meetingParticipants[i].participant;
      if (meetingParticipants.length - i > 1) {
        where = where + ',';
      } else {
        where = where + ')';
      }
    }

    return db.select('participants', ['id','pid'], function boo(item) {
      return new Participant(item.id, item.pid);
    }, where);
  }
}