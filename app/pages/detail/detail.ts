import {Component} from "@angular/core";
import {ParticipantPage} from '../participant/participant';
import {Meeting, Participant, MeetingParticipant} from '../../common/meeting';
import {NavController, NavParams} from 'ionic-angular';
import {Server} from '../../services/server'
import {ContactPage} from '../contact/contact'

@Component({
  templateUrl: 'build/pages/detail/detail.html',
  providers: [Server]
})
export class DetailPage {
  meeting: Meeting;
  startTime: string;
  endTime: string;
  title: String;

  constructor(private _navController: NavController, private _navParams: NavParams, private server: Server) {
    this.meeting = _navParams.get('meeting');
    this.title = this.meeting.title;
    //console.log(this.meeting);
    if(this.meeting.id){
        this.server.getMeetingParticipants(this.meeting.id).then( (data: Participant[]) =>{
        console.log('Got participants', data);
        // Now get the contact data from the Contacts services
        let result = [];
        for( let i = 0; i < data.length; i++){
          let contact = server.getContact(data[i].pid);
          // console.log('Contact', contact);
          if(contact){
            result.push(contact);
          } else {
            console.log('No Contant');
          }
        }
        console.log('Contacts', result);
        this.meeting.participants = result;
      });
      }
      //console.log(this.meeting);
      
      this.startTime = this.meeting.startTime ? this.meeting.startTime.toISOString() : (new Date()).toISOString();
      this.endTime = this.meeting.endTime ? this.meeting.endTime.toISOString() : (new Date()).toISOString();
  }

  deleteParticipant(event, p: Participant) {
    console.log('delete', p);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
    MeetingParticipant.delete(this.server.db, this.meeting.id, p.pid).then((data) => {
      console.log(data);
      for (let i = 0; i < this.meeting.participants.length; i++){
        let par = this.meeting.participants[i];
        if(par.pid == p.pid){
          this.meeting.participants.splice(i, 1);
          break;
        }
      }
    });
  }

  editParticipant(event, name) {
    if (this.meeting.scheduled) {
      console.log('edit', name);
      event.preventDefault(); // added for ionic
      event.stopPropagation();
      this._navController.push(ParticipantPage, { participant: name, meeting: this.meeting });
    }
  }

  track(){
    this.meeting.scheduled = true;
  }

  unTrack(){
    this.meeting.scheduled = false;
  }

  editMeeting(){
    this.meeting.startTime = new Date(this.startTime);
    this.meeting.endTime = new Date(this.endTime);
    console.log(this.meeting);
    this.meeting.update(this.server.db);
  }

  onTitleBlur(){
    if (this.title != this.meeting.title){
      this.meeting.title = this.title;
      this.meeting.update(this.server.db);
    }
  }

  addParticipant(event, newItem){
    this._navController.push(ContactPage, { meeting: this.meeting });
  }
}
