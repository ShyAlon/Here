import {Component} from "@angular/core";
import {ParticipantPage} from '../participant/participant';
import {Meeting} from '../../common/meeting';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/detail/detail.html'
})
export class DetailPage {
  meeting: Meeting;

  constructor(private _navController: NavController, private _navParams: NavParams) {
    this.meeting = _navParams.get('meeting');
  }

  deleteParticipant(event, name) {
    console.log('delete', name);
    event.preventDefault(); // added for ionic
    event.stopPropagation();
  }

  editParticipant(event, name) {
    if (this.meeting.scheduled) {
      console.log('edit', name);
      event.preventDefault(); // added for ionic
      event.stopPropagation();
      this._navController.push(ParticipantPage, { participant: name });
    }
  }

  track(){
    this.meeting.scheduled = true;
  }

  unTrack(){
    this.meeting.scheduled = false;
  }
}
