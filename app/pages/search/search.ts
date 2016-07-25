import {Component} from '@angular/core'
import {NavController} from 'ionic-angular'
import {AlbumDetailsPage} from '../album-details/album-details'
import {NmlService} from '../../services/nml.service'
import {Album} from "../../models/nml"
import {AlbumListComponent} from "../../components/album-list/album-list"
import {Observable} from "rxjs";

@Component({
  templateUrl: 'build/pages/search/search.html',
  providers: [NmlService],
  directives: [AlbumListComponent]
})
export class SearchPage {
  albums: Observable<Array<Album>>

  constructor(private navCtrl: NavController, private nmlService: NmlService) {
  }

  private search({target: {value}}) {
    if (!value || !value.trim()) return

    this.albums = this.nmlService.search(value).map(albums => albums.tracklists)
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumDetailsPage, {album})
  }
}
