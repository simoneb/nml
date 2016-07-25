import {Component, OnInit, OnDestroy} from '@angular/core'
import {NavController, NavParams} from 'ionic-angular'
import {Album, Track} from '../../models/nml'
import {NmlService} from "../../services/nml.service"
import {groupBy, toPairs} from 'lodash'

@Component({
  templateUrl: 'build/pages/album-details/album-details.html',
  providers: [NmlService]
})
export class AlbumDetailsPage implements OnInit, OnDestroy {
  ngOnInit(): any {
    this.nmlService.album(this.albumId)
      .subscribe(album => {
        this.album = album
        this.trackGroups = toPairs(groupBy(album.tracks, 'group'))
        this.albumImageUrl = this.nmlService.signResourceUrl(album.artwork)
      })
  }

  ngOnDestroy(): any {
    this.stop()
  }

  albumId: number
  album: Album
  trackGroups: Array<Array<any>>
  albumImageUrl: string
  audio: any
  currentlyPlaying: Track

  constructor(private navCtrl: NavController, navParams: NavParams, private nmlService: NmlService) {
    this.albumId = navParams.get('album').id
  }

  play(track: Track) {
    const wasPlaying = this.currentlyPlaying
    this.stop()

    if(wasPlaying === track) return

    this.audio = new Audio(this.nmlService.signResourceUrl(track.audio))
    this.audio.play()
    this.currentlyPlaying = track
  }

  stop() {
    if (this.audio) this.audio.pause()
    this.currentlyPlaying = null
  }
}
