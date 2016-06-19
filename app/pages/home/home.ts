import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {DetailPage} from '../detail/detail';
import {Server} from '../../services/server';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Server]
})
export class HomePage {
  items:String[];
  server:Server;
  constructor(private _navController: NavController, server: Server) {
    this.server = server;
    this.items = this.server.getMeetings();
  }

  pushPage(buttonColor: string) {
    this._navController.push(DetailPage, { color: buttonColor });
  }
}
