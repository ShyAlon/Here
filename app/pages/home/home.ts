import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {DetailPage} from '../detail/detail';
import {Server} from '../../services/server';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Server]
})
export class HomePage {
  items:Object;
  server:Server;
  constructor(private _navController: NavController, server: Server) {
    this.server = server;
    this.server.getMeetings().then(data =>{
      this.items = data;
    })
  }

  pushPage(meeting: Object) {
    this._navController.push(DetailPage, { meeting: meeting });
  }


}
