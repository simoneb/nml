import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NmlService} from '../../services/nml.service'
import {ListPage} from '../list/list'

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  auth: {name: String, password: String};

  constructor(private navCtrl: NavController,
              private nmlService: NmlService) {
    this.auth = {name: '', password: ''}
  }

  login(event) {
    this.nmlService
      .login(this.auth.name, this.auth.password)
      .subscribe(() => this.navCtrl.setRoot(ListPage), err => {
        throw err
      })
  }
}
