import {Component, OnInit} from '@angular/core'
import {NavController} from 'ionic-angular'
import {AlbumDetailsPage} from '../album-details/album-details'
import {NmlService} from '../../services/nml.service'
import {Album} from '../../models/nml'
import {AlbumListComponent} from '../../components/album-list/album-list'
import {Observable} from 'rxjs'
import {PlayerComponent} from '../../components/player/player'

@Component({
  templateUrl: 'build/pages/list/list.html',
  directives: [AlbumListComponent, PlayerComponent]
})
export class ListPage implements OnInit {
  ngOnInit() {
    this.loadFirstPage()
  }

  albums: Observable<Array<Album>>

  constructor(private navCtrl: NavController, private nmlService: NmlService) {
  }

  private loadFirstPage() {
    this.albums = this.nmlService.albums({P: 1, PP: 10})
      .map(albums => albums.tracklists)
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumDetailsPage, {album})
  }
}
