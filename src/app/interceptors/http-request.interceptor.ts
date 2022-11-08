import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      // Tell the browser to stores the Cookie received from login()
      // and sends it with HTTP requests inside a Cookie HTTP header.
      withCredentials: true
    })

    // next: HttpHandler object represents the next interceptor
    // in the chain of interceptors. The final ‘next’ in the chain
    // is the Angular HttpClient.
    return next.handle(request);
  }
}
