import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>
  constructor(
    private db: AngularFirestore
  ) {
    this.clipsCollection = db.collection('clips')
  }

  // Add a clip data to the collection 'clips' in the database:
  async createClip(data: IClip) {
    // we use add() instead of set() because add() will instruct
    // Firebase to generate an id instead of passing an id to it
    // and we dont care about the id in this case.
    await this.clipsCollection.add(data)
  }
}
