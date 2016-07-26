import {Injectable} from '@angular/core'
import {PlayerQueue} from './player-queue'
import {QueueItem} from '../models/nml'
import {NmlService} from './nml.service'
import {BehaviorSubject} from 'rxjs'

@Injectable()
export class PlayerService {
  private source
  private audio

  currentItem: BehaviorSubject<QueueItem> = new BehaviorSubject(null)
  currentlyPlaying: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(private queue: PlayerQueue, private nmlService: NmlService) {
    this.source = queue.subscribe(this.play)
  }

  resume() {
    this.audio.play()
    this.currentlyPlaying.next(true)
  }

  pause() {
    this.audio.pause()
    this.currentlyPlaying.next(false)
  }

  private play = (item: QueueItem) => {
    const running = this.currentItem.value

    if (running) this.stop()

    this._play(item)
  }

  private _play(item: QueueItem) {

    this.currentItem.next(item)
    this.audio = new Audio(this.nmlService.signResourceUrl(item.track.audio))
    this.audio.addEventListener('ended', this.onAudioEnd)

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
      // 'progress',
      'ratechange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      // 'timeupdate', // too verbose
      'volumechange',
      'waiting'
    ]
    events.forEach(name => this.audio.addEventListener(name, console.log.bind(console, name)))

    this.resume()
  }

  private onAudioEnd = () => {
    const {album, album: {tracks}, track} = this.currentItem.value
    const trackIndex = tracks.indexOf(track)

    if (trackIndex < tracks.length - 1) {
      this.play({album, track: tracks[trackIndex + 1]})
    }
  }

  private stop() {
    if (this.audio) this.pause()
    this.currentItem.next(null)
  }
}
