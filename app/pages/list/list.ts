import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AlbumDetailsPage} from '../album-details/album-details';
import {NmlService} from '../../services/nml.service'
import {Album} from "../../models/nml";

@Component({
  templateUrl: 'build/pages/list/list.html',
  providers: [NmlService]
})
export class ListPage implements OnInit {
  ngOnInit(): any {
    this.loadFirstPage()
  }

  albums: Array<Album>
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(private navCtrl: NavController, navParams: NavParams, private nmlService: NmlService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  private loadFirstPage() {
    this.nmlService.albums({P: 1, PP: 20})
      .subscribe(albums => {
        this.albums = albums.tracklists
      })
  }

  goToAlbum(event, album) {
    this.navCtrl.push(AlbumDetailsPage, {
      album
    });
  }
}
