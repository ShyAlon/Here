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
  items:Meeting[];

  constructor(private _navController: NavController, private server: Server){//, private db: DB) {
    this.server.getMeetings().then( (data: Meeting[]) =>{
      //console.log('Got meetings');
      this.items = data;
      // for( let i = 0; i < data.length; i++){
      //   data[i].insert(this.server.db);
      // }
      // let pool = Server.getPool();
      // for(let i = 0; i < pool.length; i++){
      //   console.log('Insert', pool[i]);
      //   pool[i].insert(this.server.db);
      // }
    });
  }

  pushPage(meeting: Meeting) {
    console.log('pushing');
    this._navController.push(DetailPage, { meeting: meeting });
  }
}
