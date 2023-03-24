import { ComponentFactoryResolver, Injectable } from "@angular/core";
import {
  Firestore,
  collectionData,
  collection,
  docData,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class SleepLoggerService {
  constructor(private firestore: Firestore) {}

  getSleepData() {
    const sleepDataRef = collection(this.firestore, "sleepData");
    return collectionData(sleepDataRef, { idField: "id" });
  }

  getSleepDataById(id) {
    const sleepDataRef = doc(this.firestore, `sleepData/${id}`);
    return docData(sleepDataRef, { idField: "id" });
  }

  addSleepData(wakeDate, sleepData) {
    // const sleepDataRef = collection(this.firestore, `sleepData`);
    // return addDoc(sleepDataRef, sleepData);
    return setDoc(doc(this.firestore, "sleepData", wakeDate), sleepData);
  }

  async addRating(rateDateTime, rating) {
    // console.log(rateDate);
    // console.log(rateTime);
    // console.log(rating);
    let rateDate = this.getISODate(rateDateTime);

    const docRef = doc(this.firestore, "sleepData", rateDate);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let newRatings = docSnap.data().ratings;
      // console.log(newRatings);
      newRatings[rateDateTime] = rating;
      // console.log(newRatings);
      updateDoc(docRef, {
        ratings: newRatings,
      });
    }
  }

  async deleteRating(rateDateTime) {
    let rateDate = this.getISODate(rateDateTime);

    const docRef = doc(this.firestore, "sleepData", rateDate);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let newRatings = docSnap.data().ratings;
      delete newRatings[rateDateTime];

      let i = 0;
      for (var r in newRatings) {
        i++;
      }
      if (i != 0) {
        updateDoc(docRef, {
          ratings: newRatings,
        });
      }
      else {
        deleteDoc(docRef);
      }
    }
  }

  async deleteLog(wakeDate) {
    let rateDate = this.getISODate(wakeDate);

    const docRef = doc(this.firestore, "sleepData", wakeDate);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let oldRatings = docSnap.data().ratings;

      let i = 0;
      for (var r in oldRatings) {
        i++;
      }
      if (i != 0) {
        console.log('ratings not empty');
        updateDoc(docRef, {
          wakeDateTime: "None",
            sleepDateTime: "None",
            moodValue: 0,
            ratings: oldRatings,
        });
      }
      else {
        deleteDoc(docRef);
      }
    }
  }

private getISODate(isoDateTime) {
    return isoDateTime.substring(0, 10);
  }

  deleteSleepData(sleepData) {
    const sleepDataRef = doc(this.firestore, `sleepData/${sleepData.id}`);
    return deleteDoc(sleepDataRef);
  }

  // updateSleepData(sleepData) {
  //   const sleepDataRef = doc(this.firestore, `sleepData/${sleepData.id}`);
  //   return updateDoc(sleepDataRef, {
  //     wakeTime: sleepData.wakeTime,
  //     sleepTime: sleepData.sleepTime,
  //     sleepDate: sleepData.sleepDate,
  //     dayLogged: sleepData.dayLogged,
  //     ratings: sleepData.ratings
  //   });
  // }
}
