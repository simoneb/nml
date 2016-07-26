import {Component} from '@angular/core'
import {PlayerService} from '../../services/player.service'
import {Observable, BehaviorSubject} from 'rxjs'
import {QueueItem} from '../../models/nml'
import {NmlService} from '../../services/nml.service'
import {NavController} from "ionic-angular";
import {AlbumDetailsPage} from "../../pages/album-details/album-details";

@Component({
  selector: 'player',
  templateUrl: 'build/components/player/player.html'
})
export class PlayerComponent {
  private currentItem: BehaviorSubject<QueueItem>
  private currentlyPlaying: Observable<boolean>
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

  play() {
    this.player.resume()
  }

  pause() {
    this.player.pause()
  }
}
