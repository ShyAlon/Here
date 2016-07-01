import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {DetailPage} from '../detail/detail';
import {Server} from '../../services/server';
import {DB} from '../../services/DB';
import {Meeting} from '../../common/meeting';
import {Calendar} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Server]
})
export class HomePage {
  items: Meeting[];
  constructor(private _navController: NavController, private server: Server) {//, private db: DB) {
    if (!Server.simulation) {
      let dict = {};
      this.items = new Array<Meeting>();
      let start = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
      let end = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
      Calendar.listEventsInRange(start, end).then((data) => {
        // Android Event 
        /*
        allDay: 0
        calendar_id: "1"
        dtend: 1467189155012
        dtstart: 1467189155012
        eventLocation: ""
        event_id: "1"
        title: ""
        */

        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let cal = data[i];
            let m = new Meeting(-1, cal.dtstart, cal.dtend, cal.title, null, false, cal.eventLocation);
            dict[m.startTime.getTime()] = m;
            this.items.push(m);
          }
        }
      }).then(() => {
        this.server.getMeetings().then((data: Meeting[]) => {
          console.log(dict);
          
          for (let j = 0; j < data.length; j++) {
            let m = data[j];
            if (dict[m.startTime.getTime()]) {
              dict[m.startTime.getTime()].scheduled = true;
              console.log('Scheduled', dict[m.startTime.getTime()].title);
            }
          }
        });
      });
    }
  }

  pushPage(meeting: Meeting) {
    this._navController.push(DetailPage, { meeting: meeting });
  }

  createMeeting() {
    let meeting = new Meeting();
    meeting.insert(this.server.db).then((id) => {
      meeting.id = id;
      console.log(meeting);
      Server.items.push(meeting);
      this.pushPage(meeting);
    });
  }
}
