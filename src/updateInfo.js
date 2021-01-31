import Constants from 'expo-constants';

export default class UpdateInfo{
    static AppVersion = Constants.manifest.version;
    static OtaDeployedAt = '2021.01.31';
    static ReleaseTag = 'OTA-2021.01.31'; // Name of Release on GitHub Repo
    static ReleaseIdKey =  `${this.AppVersion}_${this.OtaDeployedAt}`;
}
