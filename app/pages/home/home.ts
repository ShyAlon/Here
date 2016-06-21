import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {DetailPage} from '../detail/detail';
import {Server} from '../../services/server';
import {Meeting} from '../../common/meeting';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Server]
})
export class HomePage {
  items:Meeting[];

  constructor(private _navController: NavController, private server: Server) {
    this.server.getMeetings().then( (data: Meeting[]) =>{
      this.items = data;
    });
  }

  pushPage(meeting: Meeting) {
    this._navController.push(DetailPage, { meeting: meeting });
  }
}
