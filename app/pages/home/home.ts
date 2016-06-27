import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {DetailPage} from '../detail/detail';
import {Server} from '../../services/server';
import {DB} from '../../services/DB';
import {Meeting} from '../../common/meeting';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Server]
})
export class HomePage {
  items: Meeting[];
  constructor(private _navController: NavController, private server: Server) {//, private db: DB) {
    this.server.getMeetings().then((data: Meeting[]) => {
      Server.items = data;
      this.items = data;
    });
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
