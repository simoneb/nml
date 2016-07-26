import {Component, Input, Output, EventEmitter} from '@angular/core'
import {Album} from "../../models/nml";
import {NmlService} from "../../services/nml.service";
import {Observable} from "rxjs";

@Component({
  selector: 'album-list',
  templateUrl: 'build/components/album-list/album-list.html'
})
export class AlbumListComponent {
  @Input() albums: Observable<Array<Album>>
  @Output() onAlbumSelected = new EventEmitter<Album>();

  constructor(private nmlService: NmlService) {
  }

  selectAlbum(album: Album) {
    this.onAlbumSelected.emit(album)
  }

  getAlbumThumbnailUrl(album: Album): string {
    return this.nmlService.signResourceUrl(album.artwork, {w: 30, h: 30})
  }
}
