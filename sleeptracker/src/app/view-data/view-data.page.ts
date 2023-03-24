import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { SleepLoggerService } from "../services/sleep-logger.service";
import { HelperService } from "../services/helper.service";

interface rateInfo {
  value: number;
  time: string;
  period: string;
}

interface DateTimeInfo {
  wakeTime: string;
  wakePeriod: string;
  sleepTime: string;
  sleepPeriod: string;
  hoursSlept: string;
  ratings: rateInfo[];
  sleepDate: string;
  wakeDate: string;
  moodValue: number;
}

@Component({
  selector: "app-view-data",
  templateUrl: "./view-data.page.html",
  styleUrls: ["./view-data.page.scss"],
})
export class ViewDataPage implements OnInit {
  sleepData = [];
  selectedItemExists: boolean;
  tiredRatingExists: boolean;
  dateValue: string;
  activeDay: string;
  currentDate: string;
  currentMonth: string;
  hoursSlept: number;
  ascending: boolean;
  sortTimeValue: boolean;
  confirmFunc;
  selectedDateTimeInfo: DateTimeInfo = {
    wakeTime: "",
    wakePeriod: "",
    sleepTime: "",
    sleepPeriod: "",
    hoursSlept: "",
    sleepDate: "",
    wakeDate: "",
    moodValue: 0,
    ratings: [],
  };
  ratingsTimeSort = null;
  ratingsValueSort = null;
  rateColors: string[] = [
    "33, 181, 4",
    "0, 186, 255",
    "0, 94, 255",
    "249, 255, 0",
    "255, 115, 0",
    "255, 60, 0",
    "255, 0, 0",
  ];
  weekDays: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  scale: string[] = [
    "Feeling active, vital; alert; wide awake.",
    "Functioning at a high level, but not at peak; able to concentrate.",
    "Relaxed; awake; not at full alertness; responsive.",
    "A little foggy; not at peak; let down.",
    "Fogginess; beginning to lose interest in remaining awake; slowed down.",
    "Sleepiness; prefer to be lying down; fighting sleep; woozy.",
    "Almost in reverie; sleep onset soon; lost struggle to remain awake.",
  ];
  moods: string[] = ["happy", "indifferent", "anxious", "sick", "sleepy"];

  constructor(
    public router: Router,
    private sleepLogger: SleepLoggerService,
    private alertController: AlertController,
    private helper: HelperService
  ) {
    let cl = this.sleepLogger.getSleepData().subscribe((res) => {
      this.sleepData = res;
      cl.unsubscribe();
    });
  }

  ngOnInit() {
    this.updateDateMonth(new Date());
    this.activeDay = this.weekDays[new Date().getDay()];
    this.parseFbRes(new Date());
    this.ascending = false;
    this.sortTimeValue = true;
  }



  // -------------------------------- GETTERS --------------------------------
  getMoodImage(moodIndex): string {
    return "/assets/mood/" + this.moods[moodIndex] + ".png";
  }

  getPieStyle(rateValue: number) {
    let style: string =
      "--p:" +
      (
        ((this.rateColors.length + 1 - rateValue) / this.rateColors.length) *
        100
      ).toString() +
      "; --c: rgba(" +
      this.rateColors[rateValue - 1] +
      ");";
    return style;
  }

  getPopStyle(rateValue: number) {
    let style: string =
      "--c: rgba(" + this.rateColors[rateValue - 1] + ", .95);";
    return style;
  }

  private getWeekDay(dateObj: Date) {
    return dateObj.toLocaleString("en-US", { weekday: "long" });
  }

  private getMonth(dateObj: Date) {
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  private getTime(dateObj: Date) {
    return dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  private getNewSort() {
    let newArray = [];
    if (this.sortTimeValue) {
      // sort by time again
      newArray = this.ratingsTimeSort;
    }
    else if (!this.sortTimeValue && this.ratingsValueSort) {
      // use previously made sorted by values array
      newArray = this.ratingsValueSort;
    }
    else if (!this.sortTimeValue && !this.ratingsValueSort) {
      let valuesArray = {};
      for (var r in this.selectedDateTimeInfo.ratings) {
        let rateValue = this.selectedDateTimeInfo.ratings[r].value;

        // if first rating of its kind
        if (valuesArray[rateValue] == null) {
          valuesArray[rateValue] = this.selectedDateTimeInfo.ratings[r];
        }
        // if there was already a time w/ same rating
        else {
          let tempArray = [];
          // if only one other time has the same rating
          // (not an array)
          if (!Array.isArray(valuesArray[rateValue])) {
            tempArray.push(valuesArray[rateValue]);
          }
          // if 2+ times have the same rating
          else {
            for (var v in valuesArray[rateValue]) {
              tempArray.push(v);
            }
          }
          tempArray.push(this.selectedDateTimeInfo.ratings[r]);
          valuesArray[rateValue] = tempArray;
        }
      }

      let tempArray = [];
      for (var v in valuesArray) {
        if (Array.isArray(valuesArray[v])) {
          for (var k in valuesArray[v]) {
            tempArray.push(valuesArray[v][k]);
          }
        }
        else {
          tempArray.push(valuesArray[v]);
        }
      }

      this.ratingsValueSort = tempArray;
      newArray = this.ratingsValueSort;
    }
    return newArray;
  }



  // -------------------------------- UPDATERS --------------------------------
  updateWeekDay() {
    this.activeDay = this.getWeekDay(new Date(this.dateValue));
    this.parseFbRes(new Date(this.dateValue));
  }

  updateCalendar() {
    let newDate = new Date(this.dateValue);
    let selectedDayNum = this.weekDays.indexOf(
      this.getWeekDay(new Date(this.dateValue))
    );
    let currentDayNum = this.weekDays.indexOf(this.activeDay);
    let addDay = currentDayNum - selectedDayNum;
    newDate.setDate(newDate.getDate() + addDay);
    this.updateDateMonth(newDate);
  }

  private parseFbRes(dateObj: Date) {
    this.selectedItemExists = false;
    this.tiredRatingExists = false;

    let fbItem = this.sleepLogger.getSleepDataById(
      this.helper.getISODate(this.helper.toISOStringLocal(dateObj))
    );
    let cl = fbItem.subscribe((res) => {
      if (typeof res != "undefined") {
        if (!this.isEmpty(res.ratings)) this.tiredRatingExists = true;
        if (res.sleepDateTime != "None") {
          this.selectedItemExists = true;

          //Parse Data from res
          this.selectedDateTimeInfo.moodValue = res.moodValue - 1;
          this.selectedDateTimeInfo.sleepDate = this.getMonth(
            new Date(res.sleepDateTime)
          );
          this.selectedDateTimeInfo.sleepTime = this.getTime(
            new Date(res.sleepDateTime)
          ).split(" ")[0];
          this.selectedDateTimeInfo.sleepPeriod = this.getTime(
            new Date(res.sleepDateTime)
          ).split(" ")[1];

          this.selectedDateTimeInfo.wakeDate = this.getMonth(
            new Date(res.wakeDateTime)
          );
          this.selectedDateTimeInfo.wakeTime = this.getTime(
            new Date(res.wakeDateTime)
          ).split(" ")[0];
          this.selectedDateTimeInfo.wakePeriod = this.getTime(
            new Date(res.wakeDateTime)
          ).split(" ")[1];

          if (
            this.selectedDateTimeInfo.sleepDate ==
            this.selectedDateTimeInfo.wakeDate
          ) {
            this.selectedDateTimeInfo.sleepDate = null;
          }

          let wakeDateObj: Date = new Date(res.wakeDateTime);
          let sleepDateObj: Date = new Date(res.sleepDateTime);
          wakeDateObj.setSeconds(0); // only want an estimate so seconds don't really matter
          sleepDateObj.setSeconds(0); // only want an estimate so seconds don't really matter
          this.hoursSlept = wakeDateObj.valueOf() - sleepDateObj.valueOf();
          let diff = new Date(this.hoursSlept);
          this.hoursSlept = diff.valueOf() / (60 * 60 * 1000);
          this.hoursSlept = parseFloat(
            (Math.round(this.hoursSlept * 100) / 100).toFixed(2)
          );
        } else {
          this.selectedItemExists = false;
        }

        //If ratings exist parse it
        if (this.tiredRatingExists) {
          this.selectedDateTimeInfo.ratings = [];
          // get all keys (aka times)
          let keysArray = [];
          for (var key in res.ratings) {
            keysArray.push(key);
          }

          // sort keys
          keysArray = keysArray.sort();

          // push into map according to sorted key order
          // (maps remember the order of insertion)
          let sortedRatings = new Map();
          for (var k in keysArray) {
            sortedRatings.set(keysArray[k], res.ratings[keysArray[k]]);
          }

          // copy map into selectedTimeInfo
          for (let [time, rating] of sortedRatings) {
            this.selectedDateTimeInfo.ratings.push({
              value: rating,
              time: this.getTime(new Date(time)).split(" ")[0],
              period: this.getTime(new Date(time)).split(" ")[1],
            });
          }

          this.ratingsTimeSort = this.selectedDateTimeInfo.ratings;
          this.ratingsValueSort = null;

          // if set to sort by rating
          if (this.sortTimeValue == false) {
            this.selectedDateTimeInfo.ratings = this.getNewSort();
          }
        }
      }

      cl.unsubscribe();
    });
  }

  private updateDateMonth(dateObj: Date) {
    this.currentDate = this.getWeekDay(dateObj);
    this.currentMonth = this.getMonth(dateObj);
    this.dateValue = this.helper.toISOStringLocal(dateObj);
  }

  private updateRatingsDelete(ratingTime, ratingPeriod) {
    // update time sort
    for (let i in this.ratingsTimeSort) {
      let rating = this.ratingsTimeSort[i];
      if (rating.time == ratingTime && rating.period == ratingPeriod) {
        this.ratingsTimeSort.splice(parseInt(i), 1);
        break;
      }
    }

    // update value sort
    for (let i in this.ratingsValueSort) {
      let rating = this.ratingsValueSort[i];
      if (rating.time == ratingTime && rating.period == ratingPeriod) {
        this.ratingsValueSort.splice(parseInt(i), 1);
        break;
      }
    }

    // update current
    if (this.sortTimeValue) {
      this.selectedDateTimeInfo.ratings = this.ratingsTimeSort;
    }
    else {
      this.selectedDateTimeInfo.ratings = this.ratingsValueSort;
    }
  }



  // -------------------------------- SORT ORDER ------------------------------
  reverseOrder() {
    this.ascending = !this.ascending;
  }

  changeSort() {
    this.sortTimeValue = !this.sortTimeValue;
    this.selectedDateTimeInfo.ratings = this.getNewSort();
  }



  // -------------------------- DELETE RATING ---------------------------------
  deleteRatingConfirm(ratingTime: string) {
    this.deleteRating(ratingTime);
    this.helper.presentToast("middle", "Tired Rating Deleted!", "bad-toast");
  }

  private deleteRating(ratingTime: string) {
    ratingTime = ratingTime.replace('AM', ' AM');
    ratingTime = ratingTime.replace('PM', ' PM');

    let ratingDate = new Date(this.helper.getISODate(this.dateValue) + ' ' + ratingTime);
    let ratingISODate = this.helper.toISOStringLocal(ratingDate);

    this.sleepLogger.deleteRating(ratingISODate);
    this.updateRatingsDelete(ratingTime.split(" ")[0],
    ratingTime.split(" ")[1]);
  }



  // ------------------------------- DELETE LOG -------------------------------
  deleteLogConfirm() {
    this.deleteLog();
    this.helper.presentToast("middle", "Sleep Log Deleted!", "bad-toast");
  }

  private deleteLog() {
    this.sleepLogger.deleteLog(this.helper.getISODate(this.helper.toISOStringLocal(new Date(this.dateValue))));
    this.selectedItemExists = false;
  }


  //  -------------------------------- HELPERS --------------------------------
  private isEmpty(obj): boolean {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  async presentAlert(text: string, customCss: string, confirmFunc, paras = null) {
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
      this.confirmFunc(paras);
    }
  }
}
