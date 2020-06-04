import Constants from 'expo-constants';

export default class UpdateInfo{
    static AppVersion = Constants.manifest.version;
    static OtaDeployedAt = '2020.03.30';
    static ReleaseTag = 'OTA-2020.03.30'; // Name of Release on GitHub Repo
    static ReleaseIdKey =  `${this.AppVersion}_${this.OtaDeployedAt}`;
}