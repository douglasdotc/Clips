import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(
    // Pipes are not injectable by default, so we
    // need to register DataPipe as a provider
    // in the components/modules that use our pipe (which use DataPipe).
    private datePipe: DatePipe
  ) {}

  transform(value: firebase.firestore.FieldValue | undefined) {
    // Guard the function for undefined values:
    if(!value) {
      return ''
    }

    // Transform the firebase TimeStamp to Date:
    const date = (value as firebase.firestore.Timestamp).toDate()
    // Transform the Date to mediumDate using DataPipe:
    return this.datePipe.transform(date, 'mediumDate')
  }

}
