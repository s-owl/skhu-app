
import { AsyncStorage } from 'react-native';
export default class ForestApi{
    constructor(url){
        this.url = url;
    }
    // login(201632034, password).then((response)=>{ //things to do after login })
    login(userid, userpw){
        let loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        return fetch(`${this.url}/user/login`, 
        {
            method: 'POST',
            headers: loginHeaders,
            body: JSON.stringify({
            userid :userid.toString(),
            userpw :userpw.toString()
        })
    });
    }

    async get(path, withCredential){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if(withCredential){
            headers.append("Credential", await AsyncStorage.getItem("CredentialOld"));
        }
        return fetch(`${this.url}${path}`, {
            method: 'GET',
            headers: headers
        });
    }

    async post(path, body, withCredential){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if(withCredential){
            headers.append("Credential", await AsyncStorage.getItem("CredentialOld"));
        }
        return fetch(`${this.url}${path}`, {
            method: 'POST',
            headers: headers,
            body: body
        });
    }

    async getFromSam(path){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Cookie", await AsyncStorage.getItem("CredentialNew"));
        headers.append("RequestVerificationToken", await AsyncStorage.getItem("CredentialNewToken"));
        return fetch(`http://sam.skhu.ac.kr${path}`, {
            method: 'GET',
            headers: headers
        });
    }

    async postToSam(path, body){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Cookie", await AsyncStorage.getItem("CredentialNew"));
        headers.append("RequestVerificationToken", await AsyncStorage.getItem("CredentialNewToken"));
        return fetch(`http://sam.skhu.ac.kr${path}`, {
            method: 'POST',
            headers: headers,
            body: body
        });
    }
}