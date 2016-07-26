import {Component, OnInit} from '@angular/core'
import {NavController, NavParams} from 'ionic-angular'
import {Album, Track} from '../../models/nml'
import {NmlService} from '../../services/nml.service'
import {groupBy, toPairs} from 'lodash'
import {PlayerQueue} from '../../services/player-queue'
import {PlayerComponent} from '../../components/player/player'

@Component({
  templateUrl: 'build/pages/album-details/album-details.html',
  directives: [PlayerComponent]
})
export class AlbumDetailsPage implements OnInit {
  ngOnInit(): any {
    this.nmlService.album(this.albumId)
      .subscribe(album => {
        this.album = album
        this.trackGroups = toPairs(groupBy(album.tracks, 'group'))
        this.albumImageUrl = this.nmlService.signResourceUrl(album.artwork)
      })
  }

  albumId: number
  album: Album
  trackGroups: Array<Array<any>>
  albumImageUrl: string

  constructor(private navCtrl: NavController,
              navParams: NavParams,
              private nmlService: NmlService,
              private playerQueue: PlayerQueue) {
    this.albumId = navParams.get('album').id
  }

  play(track: Track) {
    this.playerQueue.enqueue({track, album: this.album})
  }
}
