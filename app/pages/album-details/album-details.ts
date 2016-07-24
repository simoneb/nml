import {Component} from '@angular/core'
import {NavController, NavParams} from 'ionic-angular'
import {Album} from '../../models/nml'
import {NmlService} from "../../services/nml.service";

@Component({
  templateUrl: 'build/pages/album-details/album-details.html',
  providers: [NmlService]
})
export class AlbumDetailsPage {
  selectedAlbum: Album

  constructor(private navCtrl: NavController, navParams: NavParams, nmlService: NmlService) {
    nmlService.album(navParams.get('album').id)
      .subscribe(album => {
        this.selectedAlbum = album
      })
  }
}
