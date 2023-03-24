import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { SleepService } from "../services/sleep.service";
import { SleepLoggerService } from "../services/sleep-logger.service";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "app-rate-tiredness",
  templateUrl: "./rate-tiredness.page.html",
  styleUrls: ["./rate-tiredness.page.scss"],
})
export class RateTirednessPage implements OnInit {
  scale: string[] = [
    "Feeling active, vital; alert; wide awake.",
    "Functioning at a high level, but not at peak; able to concentrate.",
    "Relaxed; awake; not at full alertness; responsive.",
    "A little foggy; not at peak; let down.",
    "Fogginess; beginning to lose interest in remaining awake; slowed down.",
    "Sleepiness; prefer to be lying down; fighting sleep; woozy.",
    "Almost in reverie; sleep onset soon; lost struggle to remain awake.",
  ];
  selectedScale: string;
  tiredDateTime: string;
  tiredTimeValue: string;
  confirmFunc;

  constructor(
    public sleepService: SleepService,
    public router: Router,
    private alertController: AlertController,
    private sleepLogger: SleepLoggerService,
    private helper: HelperService
  ) {
    this.tiredTimeValue = this.helper.toISOStringLocal(new Date());
    this.setTiredTime = this.tiredTimeValue;
  }

  ngOnInit() {}



  // ---------------------------------- RESET ---------------------------------
  resetValues() {
    this.selectedScale = null;
    this.tiredTimeValue = this.helper.toISOStringLocal(new Date());
    this.setTiredTime = this.tiredTimeValue;
  }

  set setTiredTime(dtValue) {
    this.tiredDateTime = this.helper.parseDateTime(dtValue);
  }



  // ---------------------------------- SAVE ----------------------------------
  saveRating() {
    //Check if item exists
    let fbItem = this.sleepLogger.getSleepDataById(
      this.helper.getISODate(this.helper.toISOStringLocal(new Date(this.tiredTimeValue)))
    );
    let fbSub = fbItem.subscribe((res) => {
      if (typeof res == "undefined") {
        this.sleepLogger.addSleepData(
          this.helper.getISODate(this.tiredTimeValue.toString()),
          {
            wakeDateTime: "None",
            sleepDateTime: "None",
            ratings: {},
          }
        );
        this.sleepLogger.addRating(
          this.helper.toISOStringLocal(
            new Date(this.removeSeconds(this.tiredTimeValue))
          ),
          Number(this.selectedScale) + 1
        );
      } else {
        this.sleepLogger.addRating(
          this.helper.toISOStringLocal(
            new Date(this.removeSeconds(this.tiredTimeValue))
          ),
          Number(this.selectedScale) + 1
        );
      }
      fbSub.unsubscribe();
    });
  }



  //  -------------------------------- HELPERS --------------------------------
  removeAt(strDate: string) {
    let lastAt: number = strDate.lastIndexOf("at");
    let strTime: string = strDate.substring(lastAt).replace("at ", "");
    let strDateTime: string = strDate.substring(0, lastAt) + strTime;
    return strDateTime;
  }

  strToISOString(strDate: string) {
    let date = new Date(strDate);
    return date.toISOString();
  }

  removeSeconds(strDate: string) {
    let len = strDate.length;
    return strDate.substring(0, len - 2) + "00";
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
