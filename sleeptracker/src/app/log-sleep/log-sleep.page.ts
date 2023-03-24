import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SleepService } from "../services/sleep.service";
import { SleepData } from "../data/sleep-data";
import { OvernightSleepData } from "../data/overnight-sleep-data";
import { AlertController } from "@ionic/angular";
import { SleepLoggerService } from "../services/sleep-logger.service";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "app-log-sleep",
  templateUrl: "./log-sleep.page.html",
  styleUrls: ["./log-sleep.page.scss"],
})
export class LogSleepPage implements OnInit {
  buttonNames: string[] = ["Morning", "Night", "Custom"];
  moods: string[] = ["happy", "indifferent", "anxious", "sick", "sleepy"];
  activeMood: Number = 0;
  activeButton: string = this.buttonNames[1];
  sleepDateTime: string;
  wakeDateTime: string;
  sleepTimeValue: string;
  wakeTimeValue: string;
  currentTime: string;
  doesLogExists: boolean;
  confirmFunc;

  constructor(
    public sleepService: SleepService,
    public router: Router,
    private sleepLogger: SleepLoggerService,
    private alertController: AlertController,
    public helper: HelperService
  ) {}

  ngOnInit() {
    // console.log(this.allSleepData);
    this.updateButton();
    this.getLogExists();
  }

  // -------------------------------- SETTERS --------------------------------
  set setSleepTime(dtValue) {
    this.sleepDateTime = this.helper.parseDateTime(dtValue);
  }

  set setWakeTime(dtValue) {
    this.wakeDateTime = this.helper.parseDateTime(dtValue);
  }

  // -------------------------------- GETTERS --------------------------------
  /* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
  get allSleepData() {
    return SleepService.AllSleepData;
  }

  getMoodImage(moodIndex): string {
    return "/assets/mood/" + this.moods[moodIndex] + ".png";
  }

  getLogExists() {
    let value = this.sleepTimeValue;
    if (this.activeButton == this.buttonNames[1]) value = this.wakeTimeValue;

    let fbRes = this.sleepLogger.getSleepDataById(
      this.helper.getISODate(this.helper.toISOStringLocal(new Date(value)))
    );

    let fbSub = fbRes.subscribe((res) => {
      this.doesLogExists = false;
      if (typeof res != "undefined") {
        if (res.wakeDateTime != "None") this.doesLogExists = true;
      }
      fbSub.unsubscribe();
    });
  }

  getCurrentHour() {
    return new Date()
      .toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
      .split(" ")[0];
  }

  getCurrentPeriod() {
    return new Date()
      .toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
      .split(" ")[1];
  }

  getCurrentMonth() {
    return new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  getWeekDay() {
    return new Date().toLocaleString("en-US", { weekday: "long" });
  }

  // --------------------------------- UPDATE ---------------------------------
  updateButton() {
    this.currentTime = this.helper.parseDateTime(null);
    //Morning
    if (this.activeButton == this.buttonNames[0]) {
      this.wakeTimeValue = this.helper.toISOStringLocal(new Date());
      this.sleepTimeValue = this.helper.toISOStringLocal(
        this.addHoursToDate(new Date(), -7)
      );
    }
    //Night
    else if (this.activeButton == this.buttonNames[1]) {
      this.sleepTimeValue = this.helper.toISOStringLocal(new Date());
      this.wakeTimeValue = this.helper.toISOStringLocal(
        this.addHoursToDate(new Date(), 7)
      );
    }
    //Custom
    else {
      this.sleepTimeValue = this.helper.toISOStringLocal(
        this.addHoursToDate(new Date(), -7)
      );
      this.wakeTimeValue = this.helper.toISOStringLocal(new Date());
    }

    this.setWakeTime = this.wakeTimeValue;
    this.setSleepTime = this.sleepTimeValue;
  }

  // ---------------------------------- SAVE ----------------------------------
  saveLogConfirm() {
    this.saveLog();
    this.helper.presentToast("middle", "Sleep Log Saved!", "good-toast");
    this.doesLogExists = true;
  }

  private saveLog() {
    //Check if ratings array exists
    let fbItem = this.sleepLogger.getSleepDataById(
      this.helper.getISODate(
        this.helper.toISOStringLocal(new Date(this.wakeTimeValue))
      )
    );
    let rateArr = {};
    let fbSub = fbItem.subscribe((res) => {
      if (typeof res != "undefined") rateArr = res.ratings;
      this.sleepLogger.addSleepData(
        this.helper.getISODate(this.wakeTimeValue.toString()),
        {
          wakeDateTime: this.helper.toISOStringLocal(
            new Date(this.wakeTimeValue)
          ),
          sleepDateTime: this.helper.toISOStringLocal(
            new Date(this.sleepTimeValue)
          ),
          moodValue: this.activeMood,
          ratings: rateArr,
        }
      );
      fbSub.unsubscribe();
    });
  }

  // --------------------------------- DELETE ---------------------------------
  deleteLogConfirm() {
    this.deleteLog();
    this.helper.presentToast("middle", "Sleep Log Deleted!", "bad-toast");
    this.doesLogExists = false;
  }

  private deleteLog() {
    this.sleepLogger.deleteLog(
      this.helper.getISODate(
        this.helper.toISOStringLocal(new Date(this.wakeTimeValue))
      )
    );
  }

  // --------------------------------- HELPERS --------------------------------
  private addHoursToDate(objDate, intHours) {
    let numberOfMlSeconds = objDate.getTime();
    let addMlSeconds = intHours * 60 * 60 * 1000;
    let newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    if (intHours < 0) new Date(numberOfMlSeconds - addMlSeconds);
    return newDateObj;
  }

  async presentAlert(text: string, customCss: string, confirmFunc) {
    const alert = await this.alertController.create({
      header: text,
      cssClass: customCss,
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          role: "confirm",
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "confirm") {
      this.confirmFunc = confirmFunc;
      this.confirmFunc();
    }
  }
}
