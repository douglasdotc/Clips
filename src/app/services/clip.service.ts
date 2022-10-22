import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { querystring } from '@firebase/util';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  // Services that connect the component to a collection in the database:
  public clipsCollection: AngularFirestoreCollection<IClip>
  // Array to store the clips returned:
  pageClips: IClip[] = []
  // Indicate whether we are processing the user's query:
  pendingRequest = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips')
  }

  // Add a clip data to the collection 'clips' in the database:
  createClip(data: IClip) : Promise<DocumentReference<IClip>>{
    // we use add() instead of set() because add() will instruct
    // Firebase to generate an id instead of passing an id to it
    // and we dont care about the id in this case.
    return this.clipsCollection.add(data)
  }

  // Get the clips that are uploaded by the user
  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const[user, sort] = values

        // It is possible that the user is null
        if (!user) {
          return of([])
        }

        // Form a query where the clip has a uid == user.uid
        const query = this.clipsCollection.ref.where(
          // name of prop to check in document, comparason operator, value to compare
          'uid', '==', user.uid
        ).orderBy(
          'timestamp', sort === '1' ? 'desc' : 'asc'
        )

        return query.get() // return a Promise of QuerySnapshot<IClip>
      }),
      // The clips are in an Observable called docs, we return the docs:
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    // Update the title of the clip and return a Promise
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    // Delete the clip and the screenshot from the storage:
    // Get the clip's reference and the screenshot's reference and delete them.
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    )

    await clipRef.delete()
    await screenshotRef.delete()

    // Delete the clip from the database:
    await this.clipsCollection.doc(clip.docID).delete()
  }

  async getClips() {
    // Guard the function from multiple request at the same time from the user
    if (this.pendingRequest) {
      return
    }
    this.pendingRequest = true

    // Form the query, get 6 clips in descending order:
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)

    // get the current lenggth of the clip list:
    const { length } = this.pageClips

    // Modify the query to start after the last clip we have received if length > 0:
    if (length) {
      // Get the last clip's docID:
      const lastDocID = this.pageClips[length - 1].docID
      // Get the last clip from the database and turn it into a Promise snapshot:
      const lastDoc = await this.clipsCollection.doc(lastDocID).get().toPromise()

      // Modify the query, startAfter() requires a snapshot as an input:
      query = query.startAfter(lastDoc)
    }

    // Execute the query:
    const snapshot = await query.get()

    // Extract the data from the query result and append the clips to the array:
    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })
    this.pendingRequest = false
  }
}
