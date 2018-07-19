
import { AsyncStorage } from 'react-native';
import BuildConfigs from '../config';
export default class ForestApi{
    static url = BuildConfigs.API_SERVER_ADDR;
    static login(userid, userpw){
      let loginHeaders = new Headers();
      loginHeaders.append('Content-Type', 'application/json');
      return fetch(`${ForestApi.url}/user/login`, 
        {
          method: 'POST',
          headers: loginHeaders,
          body: JSON.stringify({
            userid :userid.toString(),
            userpw :userpw.toString()
          })
        });
    }

    static async get(path, withCredential){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if(withCredential){
        headers.append('Credential', await AsyncStorage.getItem('CredentialOld'));
      }
      return fetch(`${ForestApi.url}${path}`, {
        method: 'GET',
        headers: headers
      });
    }

    static async post(path, body, withCredential){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if(withCredential){
        headers.append('Credential', await AsyncStorage.getItem('CredentialOld'));
      }
      return fetch(`${ForestApi.url}${path}`, {
        method: 'POST',
        headers: headers,
        body: body
      });
    }

    static async getFromSam(path){
      let headers = new Headers();
      headers.append('Cookie', await AsyncStorage.getItem('CredentialNew'));
      headers.append('RequestVerificationToken', await AsyncStorage.getItem('CredentialNewToken'));
      return fetch(`http://sam.skhu.ac.kr${path}`, {
        method: 'GET',
        headers: headers
      });
    }

   

    static async postToSam(path, body=null){
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Cookie', await AsyncStorage.getItem('CredentialNew'));
      headers.append('RequestVerificationToken', await AsyncStorage.getItem('CredentialNewToken'));
      return fetch(`http://sam.skhu.ac.kr${path}`, {
        method: 'POST',
        headers: headers,
        body: body
      });
    }
}