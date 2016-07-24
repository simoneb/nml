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
  term: string

  constructor(private navCtrl: NavController, private nmlService: NmlService) {
    this.term = ''
  }

  private search() {
    this.albums = this.nmlService.search(this.term)
      .map(albums => albums.tracklists)
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumDetailsPage, {album})
  }
}
