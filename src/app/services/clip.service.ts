import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>
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
  getUserClips() {
    return this.auth.user.pipe(
      switchMap(user => {
        // It is possible that the user is null
        if (!user) {
          return of([])
        }

        // Form a query where the clip has a uid == user.uid
        const query = this.clipsCollection.ref.where(
          //name of prop to check in document, comparason operator, value to compare
          'uid', '==', user.uid
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
    // Delete the clip from the storage:
    // Get the clip's reference and delete it.
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    await clipRef.delete()

    // Delete the clip from the database:
    await this.clipsCollection.doc(clip.docID).delete()
  }
}
