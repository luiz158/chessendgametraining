import { Component } from '@angular/core';
import { EndgameDatabaseService, ConfigurationService, Configuration, ThemeSwitcherService } from '../shared';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

@Component({
  selector: 'app-preferences',
  templateUrl: 'preferences.page.html',
  styleUrls: ['preferences.page.scss'],
})
export class PreferencesPage {

  public configuration: Configuration;
  public showThemes = false;
  public showPieceThemes = false;
  private literals: any;
  public pieceThemes = ['alpha', 'cburnett', 'chess7', 'chessnut', 'companion', 'fantasy', 'leipzig', 'letter', 'merida', 'mono', 'pirouetti', 'reilly', 'riohacha', 'shapes', 'spatial', 'symmetric'];

  constructor(
    private platform: Platform,
    private androidFullScreen: AndroidFullScreen,
    private endgameDatabaseService: EndgameDatabaseService,
    private configurationService: ConfigurationService,
    private toast: ToastController,
    public alertController: AlertController,
    public translate: TranslateService,
    private themeSwitcherService: ThemeSwitcherService) {
    this.configurationService.initialize().then(config => {
      this.configuration = config;
    });
    this.translate.get([
      'preferences.clean-dialog.title',
      'preferences.records-removed',
      'preferences.clean-dialog.subtitle',
      'preferences.clean-dialog.message',
      'preferences.clean-dialog.cancel',
      'preferences.clean-dialog.continue',
      'preferences.changes-saved']).subscribe(async res => {
        this.literals = res;
      });
  }

  toggleThemes() {
    this.showThemes = !this.showThemes;
  }
  
  selectTheme(theme) {
    this.configuration.colorTheme = theme;
    this.themeSwitcherService.setTheme(theme);
  }

  togglePieceThemes() {
    this.showPieceThemes = !this.showPieceThemes;
  }
  
  selectPieceTheme(theme) {
    this.configuration.pieceTheme = theme;
  }

  async cleanDatabase() {
    const alert = await this.alertController.create({
      header: this.literals['preferences.clean-dialog.title'],
      subHeader: this.literals['preferences.clean-dialog.subtitle'],
      message: this.literals['preferences.clean-dialog.message'],
      buttons: [
        {
          text: this.literals['preferences.clean-dialog.cancel'],
          role: 'cancel',
          cssClass: 'overlay-button',
          handler: () => {
          }
        }, {
          text: this.literals['preferences.clean-dialog.continue'],
          cssClass: 'overlay-button',
          handler: () => {
            this.endgameDatabaseService.cleanDatabase().then(async () => {
              const toast = await this.toast.create({
                message: this.literals['preferences.records-removed'],
                position: 'middle',
                color: 'success',
                duration: 1000
              });
              toast.present();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  changeFullScreen(event) {
    if (event) {
      this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode());
    } else {
      this.androidFullScreen.showSystemUI();
    }
  }

  save() {
    this.configurationService.save().then(async () => {
      const toast = await this.toast.create({
        message: this.literals['preferences.changes-saved'],
        position: 'middle',
        color: 'success',
        duration: 1000
      });
      toast.present();
    });
  }

}
