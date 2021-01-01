import { Component, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { AuthenticationService } from '../services/authentication.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Health } from '../models/health';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

const Period = {
  Week: 'week',
  Month: 'month',
  ThreeMonth: 'threeMonth',
  Year: 'year',
  ThreeYear: 'threeYear',
} as const;
type Period = typeof Period[keyof typeof Period];

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  // TODO: 身体情報を取得する
  // TODO: 当日を起点に日付文字列を適当数作成する
  @ViewChild('lineChart') lineChart;

  public bars: any;
  public colorArray: any;
  public selectedPeriodTab: Period = 'week';
  private myHealthCollection: AngularFirestoreCollection<Health>;
  private myHealths: Health[] = [];
  private dateLabelList: string[];

  constructor(
    private authenticationService: AuthenticationService,
    private spinnerService: SpinnerService,
    private afStore: AngularFirestore
  ) {}

  public ionViewDidEnter() {
    this.getHealths();
    this.createDateLabelList();
    this.createBarChart();
  }

  public createBarChart() {
    this.bars = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['12/11', '12/12', '12/13', '12/14', '12/15', '12/16', '12/17'],
        datasets: [
          {
            label: '体重 kg',
            data: [74.3, 75.0, 74.6, 75.0, 74.3, 74.6, 75.2],
            lineTension: 0, // 曲線ではなく直線にする
            fill: false, // グラフの背景色を消す
            borderColor: 'rgb(56, 128, 255)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true, // レスポンシブ
        maintainAspectRatio: false, // サイズ変更の際に、元のキャンバスのアスペクト比を維持しない
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * 期間タブをクリックする
   *
   * @param {Period} period
   * @memberof Tab2Page
   */
  public clickPeriodTab(period: Period) {
    console.log(period);
    this.selectedPeriodTab = period;
    this.updateChart();
  }

  private updateChart() {}

  /**
   * FirestoreからHealthデータを取得する
   *
   * @private
   * @memberof Tab1Page
   */
  private async getHealths(): Promise<void> {
    const user = await this.authenticationService.getCurrentUser();
    // ログインユーザーの全Healthデータを取得する
    this.myHealthCollection = this.afStore.collection('health', (ref) =>
      ref.orderBy('createdDate', 'desc').where('createdUser', '==', user.uid)
    );

    this.myHealthCollection.valueChanges().subscribe((myHealths) => {
      this.spinnerService.show();
      this.myHealths = myHealths;
      this.spinnerService.hide();
    });
  }

  /**
   * グラフの日付ラベルのリストを作成する
   *
   * @private
   * @memberof Tab2Page
   */
  private createDateLabelList() {
    switch (this.selectedPeriodTab) {
      case Period.Week:
        console.log('week');
        break;
    }
  }
}
