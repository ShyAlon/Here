import {Component} from "@angular/core";
import {NavController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/detail/detail.html'
})
export class DetailPage {
  meeting: Object;

  constructor(private _navController: NavController, private _navParams: NavParams) {
    this.meeting = _navParams.get('meeting');
  }
}
