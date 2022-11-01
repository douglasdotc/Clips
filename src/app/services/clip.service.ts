import { HttpClient, HttpErrorResponse, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';
import Response from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  // Array to store the clips returned:
  pageClips: IClip[] = []
  // Indicate whether we are processing the user's query:
  pendingRequest = false
  // Clip API URL:
  private readonly apiUrl = 'http://localhost:8080/api/v1/clip';

  constructor(
    private router: Router,

    // Firebase:
    private auth: AngularFireAuth,

    // Spring Boot requires HTTP:
    private http: HttpClient
  ) { }

  // We use resolvers to get data from Firebase for this page,
  // resolvers are functions that return data for a page component.
  // The router will run the function before loading the page component.
  resolve(
    // route store information for the route that we are being visited.
    route: ActivatedRouteSnapshot,
    // state store the current representation of our route in a tree.
    state: RouterStateSnapshot
  ) {
    // return an Observable<IClip>:
    return this.getClip(route.params.id)
    .pipe(
      map(response => {
        // Get clip info from response:
        const data = (response.data.clip as IClip)

        // If the clip does not exist, we redirect the user to home page:
        if (!data) {
          this.router.navigate(['/'])
          return null
        }

        // If data exist we return the data:
        return data
      })
    )
  }

  // Data Base:
  // Add a clip data to the collection 'clips' in the database:
  async createClip(clip: IClip) : Promise<IClip> {
    const response = await this.http.post<Response>(`${this.apiUrl}/db/createClip`, clip).toPromise()
    return (response?.data.clip as IClip)
  }

  // Get the clips that are uploaded by the user
  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const[user, sort] = values

        // It is possible that the user is null:
        if (!user) {
          return of([])
        }

        // Set params:
        let receivedParams = new HttpParams()
        receivedParams = receivedParams.append('uid', user.uid)
        receivedParams = receivedParams.append('sort', sort)

        // Get clips:
        return this.http.get<Response>(`${this.apiUrl}/db/getAllClipsForUser`, {
          params : receivedParams
        })
      }),
      // Map response to the array of clips:
      map(response => (response as Response)?.data.clips as IClip[])
    )
  }

  async updateClip(id: string, title: string) : Promise<boolean> {
    // Set parameters:
    let receivedParams = new HttpParams()
    receivedParams = receivedParams.append('docID', id)
    receivedParams = receivedParams.append('title', title)

    // Update the title of the clip and return a Promise:
    const response = await this.http.put<Response>(`${this.apiUrl}/db/updateClip`, null, {
      params : receivedParams
    }).toPromise()
    return response?.data.isClipUpdated
  }

  async deleteClip(clip: IClip) : Promise<boolean> {
    // Delete the clip and the screenshot from the storage:
    // Get the clip's reference and the screenshot's reference and delete them.
    await this.delete(`clips/${clip.fileName}`)
    await this.delete(`screenshots/${clip.screenshotFileName}`)

    // Delete the clip from the database:
    // await this.clipsCollection.doc(clip.docID).delete()
    const response = await this.http.delete<Response>(`${this.apiUrl}/db/deleteClip`, {
      params: new HttpParams().set('docID', (clip.docID as string))
    }).toPromise()
    return response?.data.isClipDeleted
  }

  async getClips() {
    // Guard the function from multiple request at the same time from the user
    if (this.pendingRequest) {
      return
    }
    this.pendingRequest = true

    // get the current lenggth of the clip list:
    const { length } = this.pageClips
    let startAfter = 0

    // Modify the query to start after the last clip we have received if length > 0:
    if (length) {
      startAfter = length
    }

    // Set params:
    let currParams = new HttpParams()
    currParams = currParams.append("startAfter", startAfter)
    currParams = currParams.append("limit", 6) // Get 6 clips per query.

    // Execute the query:
    const response = await this.http.get<Response>(`${this.apiUrl}/db/getClips`, {
      params : currParams
    }).toPromise()

    // Case response as an array of IClip:
    const receivedClips = (response?.data.clips as IClip[])

    // Extract the data from the query result and append the clips to the array:
    receivedClips.forEach(doc => {
      this.pageClips.push({
        ...doc
      })
    })
    this.pendingRequest = false
  }

  getClip(docID: string) : Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}/db/getClipByDocID`, {
      params: new HttpParams().set('docID', docID)
    })
  }

  // Storage:
  upload(filePath: string, file: File) : Observable<HttpEvent<Response>> {
    const formData = new FormData()

    formData.append('file', file)

    return this.http.post<Response>(`${this.apiUrl}/storage/upload`, formData, {
      reportProgress: true,
      observe: "events",
      params : new HttpParams().set('filePath', filePath)
    })
  }

  getDownloadURL(filePath: string) : Observable<Response> {
    return this.http.get<Response>(`${this.apiUrl}/storage/getDownloadURL`, {
      params : new HttpParams().set('filePath', filePath)
    })
  }

  async delete(filePath: string) : Promise<boolean> {
    const response = await this.http.delete<Response>(`${this.apiUrl}/storage/delete`, {
      params : new HttpParams().set('filePath', filePath)
    }).toPromise()

    return response?.data.isDeleted
  }
}
