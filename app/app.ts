import {Component, ViewChild, AfterViewInit} from '@angular/core'
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular'
import {StatusBar} from 'ionic-native'
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic'
import {ListPage} from './pages/list/list'
import {LoginPage} from './pages/login/login'
import {HTTP_PROVIDERS} from '@angular/http'
import './rxjs-operators'
import {AuthService} from './services/auth.service'
import {SearchPage} from "./pages/search/search"

@Component({
  templateUrl: 'build/app.html'
})
class MyApp implements AfterViewInit {
  ngAfterViewInit(): any {
    this.nav.setRoot(this.authService.isAuthenticated ? ListPage : LoginPage)
  }

  @ViewChild(Nav) nav: Nav

  pages: Array<{title: string, component: any}>

  constructor(private platform: Platform,
              private menu: MenuController,
              private authService: AuthService) {
    this.initializeApp()

    this.pages = [
      {title: 'Hello Ionic', component: HelloIonicPage},
      {title: 'Recent Additions', component: ListPage},
      {title: 'Search', component: SearchPage}
    ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault()
    })
  }

  openPage(page) {
    this.menu.close()
    this.nav.setRoot(page.component)
  }
}

let prodMode = window.hasOwnProperty('cordova');

ionicBootstrap(MyApp, [HTTP_PROVIDERS, AuthService], {prodMode})
