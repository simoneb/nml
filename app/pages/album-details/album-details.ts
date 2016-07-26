import {Component, OnInit} from '@angular/core'
import {NavParams} from 'ionic-angular'
import {Album, Track} from '../../models/nml'
import {NmlService} from '../../services/nml.service'
import {groupBy, toPairs} from 'lodash'
import {PlayerQueue} from '../../services/player-queue'
import {PlayerComponent} from '../../components/player/player'
import {PlayerService} from '../../services/player.service'
import {Observable} from "rxjs";

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
        this.albumImageUrl = this.nmlService.signResourceUrl(album.artwork, {w: 50, h: 50})
      })
  }

  albumId: number
  album: Album
  trackGroups: Array<Array<any>>
  albumImageUrl: string

  constructor(navParams: NavParams,
              private nmlService: NmlService,
              private playerQueue: PlayerQueue,
              private playerService: PlayerService) {
    this.albumId = navParams.get('album').id
  }

  play(track: Track) {
    this.playerQueue.enqueue({track, album: this.album})
  }

  playing(match: Track): Observable<boolean> {
    return this.playerService.currentItem
      .filter(item => !!item)
      .map(({track})=> track.title === match.title)
  }

  showTrackOptions(event: Event, track: Track) {
    event.stopPropagation()
  }
}
