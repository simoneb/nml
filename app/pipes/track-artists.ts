import {Pipe, PipeTransform} from '@angular/core'
import {Track} from '../models/nml'

@Pipe({name: 'trackArtists'})
export class TrackArtistsPipe implements PipeTransform {
  transform(value: Track): string {
    return value.contributors
      .filter(c => /artist/i.test(c.type))
      .map(c => c.name)
      .join(' / ')
  }
}
