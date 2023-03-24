import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {
  ModalController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { SleepLoggerService } from "../services/sleep-logger.service";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  confirmFunc;

  constructor(
    public router: Router,
    private sleepLogger: SleepLoggerService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  
  
  goHome() {
    this.router.navigate(["/home"]);
  }



  // (these functions are used across the different classes)
  // ------------------------------- DATE STUFF -------------------------------
  toISOStringLocal(dateObj: Date) {
    function z(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return (
      dateObj.getFullYear() +
      "-" +
      z(dateObj.getMonth() + 1) +
      "-" +
      z(dateObj.getDate()) +
      "T" +
      z(dateObj.getHours()) +
      ":" +
      z(dateObj.getMinutes()) +
      ":" +
      z(dateObj.getSeconds())
    );
  }

  getISODate(isoDateTime) {
    return isoDateTime.substring(0, 10);
  }

  getISOTime(isoDateTime) {
    let str = isoDateTime.substring(10);
    return str.replace("Z");
  }

  parseDateTime(dtInfo) {
    let time = new Date(dtInfo);
    if (dtInfo == null) time = new Date();
    return time.toLocaleTimeString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }



  //  -------------------------- TOAST, ALERT STUFF --------------------------
  async presentToast(
    position: "top" | "middle" | "bottom",
    messageStr: string,
    customCss: string
  ) {
    const toast = await this.toastController.create({
      message: messageStr,
      duration: 1500,
      cssClass: customCss,
      position: position,
    });

    await toast.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveLog(wakeTimeValue, sleepTimeValue, activeMood) {
    //Check if ratings array exists
    let fbItem = this.sleepLogger.getSleepDataById(
      this.getISODate(this.toISOStringLocal(new Date(wakeTimeValue)))
    );
    let rateArr = {};
    let fbSub = fbItem.subscribe((res) => {
      if (typeof res != "undefined") rateArr = res.ratings;
      this.sleepLogger.addSleepData(
        this.getISODate(this.toString()),
        {
          wakeDateTime: this.toISOStringLocal(new Date(wakeTimeValue)),
          sleepDateTime: this.toISOStringLocal(new Date(sleepTimeValue)),
          moodValue: activeMood,
          ratings: rateArr,
        }
      );
      fbSub.unsubscribe();
    });
  }

  deleteLog(wakeTimeValue) {
    this.sleepLogger.deleteLog(this.getISODate(this.toISOStringLocal(new Date(wakeTimeValue))));
  }



  //  ------------------------ OLD, COMMENTED OUT CODE ------------------------
  // //Check if ratings array exists
  // let fbItem = this.sleepLogger.getSleepDataById(
  //   this.getISODate(this.toISOStringLocal(new Date(this.wakeTimeValue)))
  // );
  // let fbSub = fbItem.subscribe((res) => {
  //   this.sleepLogger.addSleepData(
  //     this.getISODate(this.wakeTimeValue.toString()),
  //     {
  //       wakeDateTime: "None",
  //       sleepDateTime: "None",
  //       moodValue: 0,
  //       ratings: res.ratings,
  //     }
  //   );
  //   // this.sleepLogger.deleteSleepData(res);
  //   fbSub.unsubscribe();
  // });
  // --------------------------------------------------------------------------
  // async presentAlert(text: string, customCss: string, confirmFunc) {
  //   const alert = await this.alertController.create({
  //     header: text,
  //     cssClass: customCss,
  //     buttons: [
  //       {
  //         text: "No",
  //         role: "cancel",
  //         // handler: () => {
  //         //   this.handlerMessage = "Alert canceled";
  //         // },
  //       },
  //       {
  //         text: "Yes",
  //         role: "confirm",
  //         // handler: () => {
  //         //   this.handlerMessage = "Alert confirmed";
  //         // },
  //       },
  //     ],
  //   });

  //   await alert.present();
  //   const { role } = await alert.onDidDismiss();
  //   if (role == "confirm") {
  //     this.confirmFunc = confirmFunc;
  //     this.confirmFunc();
  //   }
  // }
}
