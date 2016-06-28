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
  constructor(id: Number = 0, public meeting: Number = 0, public pid: String = '', public importance: Number = 0) {
    super(id);
  }

  insert(db: DB) {
    return db.insert('meetingParticipants', ['pid', 'meeting', 'importance'], [Item.quote(this.pid), this.meeting, this.importance], this);
  }

  update(db: DB) {
    // UPDATE COMPANY SET ADDRESS = 'Texas' WHERE ID = 6;
    return db.update('meetingParticipants', ['pid', 'meeting', 'importance'], [Item.quote(this.pid), this.meeting, this.importance], this);
  }

  static select(db: DB, meetingId: Number, participantId: Number = 0) {
    let where = ' where meeting = ' + meetingId;
    if (participantId) {
      where = where + ' and pid = ' + Item.quote(participantId);
    }
    return db.select('meetingParticipants', ['id', 'pid', 'meeting', 'importance'], function boo(item) {
      return new MeetingParticipant(item.id, item.meeting, item.pid, item.importance);
    }, where);
  }

  

  static delete(db: DB, meetingId: Number, pid: string) {
    let where = ' meeting = ' + meetingId + ' and pid = ' + Item.quote(pid);
    return db.deleteWhere('meetingParticipants', where);
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
  participating: boolean;
  
  participantMeeting: MeetingParticipant;
  constructor(id = 0, public pid: string = '', public displayName: String = '', public email: String = '', public address: String = '', public gender: String = '', public phone: Phone = null) {
    super(id);
    this.participating = false;
  }

  insert(db: DB) {
    db.insert('participants', ['pid'], [Item.quote(this.pid)], this);
  }
}