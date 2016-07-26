import {Component} from '@angular/core'
import {PlayerService} from '../../services/player.service'
import {Observable, BehaviorSubject} from 'rxjs'
import {QueueItem} from '../../models/nml'
import {NmlService} from '../../services/nml.service'
import {NavController} from 'ionic-angular'
import {AlbumDetailsPage} from '../../pages/album-details/album-details'
import {TrackArtistsPipe} from '../../pipes/track-artists'

@Component({
  selector: 'player',
  templateUrl: 'build/components/player/player.html',
  pipes: [TrackArtistsPipe]
})
export class PlayerComponent {
  private currentItem: BehaviorSubject<QueueItem>
  private currentlyPlaying: BehaviorSubject<boolean>
  private albumImageUrl: Observable<string>

  constructor(private player: PlayerService,
              private nmlService: NmlService,
              private nav: NavController) {
    this.currentItem = player.currentItem
    this.currentlyPlaying = player.currentlyPlaying

    this.albumImageUrl = this.currentItem
      .filter(i => !!i)
      .map(i => i.album.artwork)
      .map(res => nmlService.signResourceUrl(res), {w: 30, h: 30})
  }

  goToAlbum() {
    const {value} = this.currentItem
    // TODO: if you click multiple times you push the same album over and over
    value && this.nav.push(AlbumDetailsPage, {album: value.album})
  }

  toggle(event: Event) {
    event.stopPropagation()

    const {value: playing} = this.currentlyPlaying

    this.player[playing ? 'pause' : 'resume']()
  }
}
