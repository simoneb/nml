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
    const runningTrack = this.currentlyPlaying

    if (runningTrack) this.stop()
    if (runningTrack === track) return

    this._play(track)
  }

  private _play(track: Track) {
    this.audio = new Audio(this.nmlService.signResourceUrl(track.audio))
    this.audio.addEventListener('ended', this.onAudioEnd.bind(this))

    // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
    const events = [
      'abort',
      'canplay',
      'canplaythrough',
      'durationchange',
      'emptied',
      'ended',
      'error',
      'loadeddata',
      'loadedmetadata',
      'loadstart',
      'pause',
      'play',
      'playing',
      'progress',
      'ratechange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeupdate',
      'volumechange',
      'waiting'
    ]
    events.forEach(name => this.audio.addEventListener(name, console.log.bind(console, name)))

    this.audio.play()
    this.currentlyPlaying = track
  }

  private onAudioEnd() {
    const {tracks} = this.album
    const trackIndex = tracks.indexOf(this.currentlyPlaying)
    this.currentlyPlaying = null

    if (trackIndex < tracks.length - 1) {
      this.play(tracks[trackIndex + 1])
    }
  }

  private stop() {
    if (this.audio) this.audio.pause()
    this.currentlyPlaying = null
  }
}
