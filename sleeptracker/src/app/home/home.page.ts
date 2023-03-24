import { Component } from "@angular/core";
// import { SleepService } from "../services/sleep.service";
// import { SleepData } from "../data/sleep-data";
// import { OvernightSleepData } from "../data/overnight-sleep-data";
import { StanfordSleepinessData } from "../data/stanford-sleepiness-data";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  //Sleep service stuff moved to log-sleep page
  //public sleepService: SleepService,
  constructor(public router: Router) {}

  ngOnInit() {
    // console.log(this.allSleepData);
  }

  // /* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
  // get allSleepData() {
  //   return SleepService.AllSleepData;
  // }

  logSleep() {
    this.router.navigate(["/log-sleep"]);
  }

  recordSleepiness() {
    this.router.navigate(["/rate-tiredness"]);
  }

  viewSleepData() {
    this.router.navigate(["/view-data"]);
  }
}
