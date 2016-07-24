import {Injectable}     from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {AuthService} from './auth.service'
import {HmacSHA1, enc} from 'crypto-js'
import {Albums, Album} from '../models/nml'

@Injectable()
export class NmlService {
  private baseUrl = 'https://api.naxosmusiclibrary.com';  // URL to web API

  constructor(private http: Http, private authService: AuthService) {
  }

  login(username, password): Observable<Object> {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({headers: headers});

    return this.http
      .post(this.baseUrl + '/Auth/Login', `username=${username}&password=${password}`, options)
      .map(this.storeCredentials)
      .catch(this.handleError);
  }

  albums(args: Object): Observable<Albums> {
    let resource = '/Album/'
    let headers = new Headers({'Accept': 'application/json'})
    let search = new URLSearchParams()

    for (let key in args) {
      search.append(key, args[key])
    }

    let options = new RequestOptions({headers, search})

    this.sign(options, resource)

    return this.http
      .get(this.baseUrl + resource, options)
      .map(this.mapResponse)
      .catch(this.handleError)
  }

  private sign(options: RequestOptions, resource: string, method: string = 'GET') {
    let expires = Math.round(new Date().getTime() / 1000) + (2 * 60 * 60 * 1000)
    let credentials = this.authService.getCredentials()
    let signature = this.generateSignature(credentials.secretkey, method, expires, resource)

    if (!options.search) options.search = new URLSearchParams()

    options.search.append('NXSAccessKeyID', credentials.accesskey)
    options.search.append('Expires', expires.toString())
    options.search.append('Signature', signature)
  }

  album(id: number): Observable<Album> {
    let resource = `/Album/${id}`
    let headers = new Headers({'Accept': 'application/json'})
    let options = new RequestOptions({headers})
    this.sign(options, resource)

    return this.http
      .get(this.baseUrl + resource, options)
      .map(this.mapResponse)
      .catch(this.handleError)
  }

  generateSignature(secretKey, method, expires, resource) {
    // see http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html
    const stringToSign = `${method}\n\n\n${expires}\n${resource}`
    return enc.Base64.stringify(HmacSHA1(stringToSign, secretKey))
  }

  private mapResponse(res: Response) {
    return res.json();
  }

  private storeCredentials(res: Response) {
    const credentials = res.json();
    this.authService.storeCredentials(credentials)
    return credentials;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
