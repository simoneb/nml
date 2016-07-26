import {QueueItem} from '../models/nml'
import {Subject, } from 'rxjs'

export class PlayerQueue {
  private queue = new Subject<QueueItem>()

  enqueue(item: QueueItem) {
    this.queue.next(item)
  }

  subscribe(fn) {
    this.queue.subscribe(fn)
  }
}
