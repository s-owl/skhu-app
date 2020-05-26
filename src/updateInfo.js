import Constants from 'expo-constants';

export default class UpdateInfo{
    static AppVersion = Constants.manifest.version;
    static OtaDeployedAt = '2020.03.30';
    static ReleaseNoteSummaryContent = `
    - 앱 업데이트 시 앱에서 업데이트 내역 보여주도록 구현
    `
    static AllReleaseUrl = 'https://github.com/s-owl/skhu-app/releases';
    static ReleaseIdKey(){
      return `${this.AppVersion}_${this.OtaDeployedAt}`;
    }

}