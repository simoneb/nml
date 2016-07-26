import {Injectable}     from '@angular/core'
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http'
import {Observable}     from 'rxjs/Observable'
import {AuthService} from './auth.service'
import {HmacSHA1, enc} from 'crypto-js'
import {Albums, Album, Resource} from '../models/nml'

function toJson(res: Response) {
  return res.json()
}

@Injectable()
export class NmlService {
  private baseUrl = 'https://api.naxosmusiclibrary.com'

  constructor(private http: Http, private authService: AuthService) {
  }

  login(username, password): Observable<any> {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    let options = new RequestOptions({headers: headers})

    return this.http
      .post(this.baseUrl + '/Auth/Login', `username=${username}&password=${password}`, options)
      .map(toJson)
      .map(credentials => this.authService.storeCredentials(credentials))
      .catch(this.handleError)
  }

  extendAuth(): Observable<any> {
    let resource = '/Auth/Extend'
    let headers = new Headers({
      'Accept': 'application/json'
    })
    let options = new RequestOptions({headers: headers})

    return this.http
      .get(this.baseUrl + resource, this.sign(resource, options))
      .map(toJson)
      .map(credentials => this.authService.storeCredentials(credentials))
      .catch(this.handleError)
  }

  logout(): Observable<any> {
    let resource = '/Auth/Logout'

    return this.http
      .get(this.baseUrl + resource, this.sign(resource))
      .map(toJson)
      .catch(this.handleError)
  }

  albums(query): Observable<Albums> {
    let resource = '/Album/'
    let headers = new Headers({'Accept': 'application/json'})
    let search = NmlService.createSearch(query)

    let options = new RequestOptions({headers, search})

    return this.http
      .get(this.baseUrl + resource, this.sign(resource, options))
      .map(toJson)
      .catch(this.handleError)
  }

  search(term: string, query = {P: 1, PP: 10}): Observable<Albums> {
    let resource = `/Search/Album/${term}`
    let headers = new Headers({'Accept': 'application/json'})
    let search = NmlService.createSearch(query)

    let options = new RequestOptions({headers, search})

    return this.http
      .get(this.baseUrl + resource, this.sign(resource, options))
      .map(toJson)
      .catch(this.handleError)
  }

  album(id: number): Observable<Album> {
    let resource = `/Album/${id}`
    let headers = new Headers({'Accept': 'application/json'})
    let options = new RequestOptions({headers})

    this.sign(resource, options)

    return this.http
      .get(this.baseUrl + resource, options)
      .map(toJson)
      .catch(this.handleError)
  }

  signResourceUrl(resource: Resource, query = {}): string {
    const {resource: resourceUrl} = resource
    let search = NmlService.createSearch(query)

    let options = new RequestOptions({search})

    this.sign(resourceUrl, options)

    return `${this.baseUrl}${resourceUrl}?${options.search}`
  }

  private sign(resource: string, options = new RequestOptions(), method = 'GET'): RequestOptions {
    let expires = Math.round(new Date().getTime() / 1000) + (2 * 60 * 60 * 1000)
    let credentials = this.authService.getCredentials()

    let signature = NmlService.generateSignature(credentials.secretkey, method, expires, resource)

    if (!options.search) options.search = new URLSearchParams()

    options.search.append('NXSAccessKeyID', credentials.accesskey)
    options.search.append('Expires', expires.toString())
    options.search.append('Signature', signature)

    return options
  }

  private static generateSignature(secretKey, method, expires, resource) {
    // see http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html
    const stringToSign = `${method}\n\n\n${expires}\n${resource}`

    return enc.Base64.stringify(HmacSHA1(stringToSign, secretKey))
  }

  private static createSearch(obj: Object = {}): URLSearchParams {
    let search = new URLSearchParams()

    for (let key in obj) {
      search.append(key, obj[key])
    }

    return search
  }

  handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error'
    console.error(errMsg) // log to console instead
    return Observable.throw(errMsg)
  }
}
