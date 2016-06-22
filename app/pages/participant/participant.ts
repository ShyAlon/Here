import {Component} from "@angular/core";
import {NavController, NavParams} from 'ionic-angular';
import {Server} from '../../services/server';
import {Meeting, Participant, Item} from '../../common/meeting';
import {DB} from '../../services/db'



@Component({
  templateUrl: 'build/pages/participant/participant.html', 
    providers: [Server, DB]

})
export class ParticipantPage {
  participant: Participant;
  newItem: String;

  constructor(private _navController: NavController, private _navParams: NavParams, private server: Server, private db: DB) {
    this.participant = <Participant>(_navParams.get('participant'));
    this.server.getperson(this.participant.id).then((participant: Participant) => this.participant = participant);
  }

  deleteItem(event, name){
    console.log('delete', name);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
    for(let i = 0; i < this.participant.items.length; i++){
      if(this.participant.items[i] == name){
        this.participant.items.splice(i, 1);
        return;
      }
    }
  }

  addItem(event, newItem){
    console.log('itemAdded', newItem);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
    this.participant.items.push(newItem);
    let item = new Item(newItem, this.participant.id);
    item.insert(this.db);
  }
}
