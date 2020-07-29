import Constants from 'expo-constants';

export default class UpdateInfo{
    static AppVersion = Constants.manifest.version;
    static OtaDeployedAt = '2020.07.30';
    static ReleaseTag = '0.6.0'; // Name of Release on GitHub Repo
    static ReleaseIdKey =  `${this.AppVersion}_${this.OtaDeployedAt}`;
}