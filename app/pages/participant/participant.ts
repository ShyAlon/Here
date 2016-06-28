import {Component} from "@angular/core";
import {NavController, NavParams} from 'ionic-angular';
import {Server} from '../../services/server';
import {Meeting, Participant, Item, MeetingParticipant} from '../../common/meeting';
import {DB} from '../../services/db'



@Component({
  templateUrl: 'build/pages/participant/participant.html', 
    providers: [Server, DB]

})
export class ParticipantPage {
  meeting: Meeting;
  participant: Participant;
  meetingParticipant: MeetingParticipant;
  newItem: String;

  constructor(private _navController: NavController, private _navParams: NavParams, private server: Server, private db: DB) {
    this.participant = <Participant>(_navParams.get('participant'));
    this.meeting = <Meeting>(_navParams.get('meeting'));
    console.log(this.meeting);

    this.server.getperson(this.participant.id)
      .then((participant: Participant) => this.participant = participant);
    this.server.getMeetingParticipant(this.participant.pid, this.meeting.id)
      .then((mp: MeetingParticipant[]) => this.gotPM(mp))
      .then(()=> this.server.getItems(this.meetingParticipant.id))
      .then((items: Item[]) => this.participant.items = items)
  }

  gotPM(mp){
    console.log(mp);
    this.meetingParticipant = mp.length > 0 ? mp[0] : null
  }

  deleteItem(event, item : Item){
    console.log('delete', item);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
    item.delete(this.db).then(()=>{
        for(let i = 0; i < this.participant.items.length; i++){
        if(this.participant.items[i].id == item.id){
          this.participant.items.splice(i, 1);
          return;
        }
      }
    });
  }

  addItem(event, newItem){
    console.log('itemAdded', newItem);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
    let item = new Item(newItem, this.participant.id);
    item.insert(this.db);
    this.participant.items.push(item);
  }

  requiredToggled(){
    this.meetingParticipant.importance = this.meetingParticipant.importance ? 0 : 1;
    this.meetingParticipant.update(this.db).then((data) => console.log('Updated', data));
  }
}
