import {Component} from "@angular/core";
import {NavController, NavParams} from 'ionic-angular';
import {Server} from '../../services/server';
import {Meeting, Participant, Item, MeetingParticipant} from '../../common/meeting';
import {DB} from '../../services/db'
import {Contacts} from 'ionic-native';


@Component({
  templateUrl: 'build/pages/contact/contact.html',
  providers: [Server, DB]

})
export class ContactPage {
  meeting: Meeting;
  participant: Participant;
  contacttobefound: string;
  contactsfound: Participant[];
  search: Boolean

  constructor(private _navController: NavController, private _navParams: NavParams, private server: Server, private db: DB) {
    this.meeting = <Meeting>(_navParams.get('meeting'));
    this.contacttobefound = '';
    this.contactsfound = new Array< Participant>();
    this.search = false;
    this.findfn('');
  }

  savefn() {
    // this._navController.push(AddcontactPage);
  }

  findfn(val) {
    if (!Server.simulation) {
      Contacts.find(['*'], { filter: val }).then((contacts: Participant[]) => {
        this.contactsfound = contacts;
        // alert(JSON.stringify(contacts[0]));
      })
      this.search = true;
    } else {
      this.contactsfound = <Participant[]>Server.getPool();
      this.search = true;
    }

    let dict = {};
    for (let i = 0; i < this.contactsfound.length; i++) {
      let c = this.contactsfound[i];
      dict[c.pid] = c;
      c.participating = false;
    }

    for (let i = 0; i < this.meeting.participants.length; i++) {
      let c = this.meeting.participants[i];
      if (dict[c.pid]) {
        dict[c.pid].participating = true;
      }
    }
  }

  contactClicked(contact: Participant) {
    if (!contact.participating) {
      let mp = new MeetingParticipant(0, this.meeting.id, contact.pid);
      mp.insert(this.server.db).then((data) => {
        this.meeting.participants = this.meeting.participants || new Array<Participant>();
        contact.id = data.res.insertId;
        this.meeting.participants.push(contact);
        console.log(data);
        this._navController.pop();
      });
    }
  }
}
