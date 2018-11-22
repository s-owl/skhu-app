
import { SecureStore } from 'expo';
import BuildConfigs from '../config';
import 'abortcontroller-polyfill';

export default class ForestApi{
    static url = BuildConfigs.API_SERVER_ADDR;
    static login(userid, userpw){
      const AbortController = window.AbortController;
      const controller = new AbortController();
      const signal = controller.signal;
      let loginHeaders = new Headers();

      setTimeout(()=>{
        controller.abort();
      }, 30000);

      loginHeaders.append('Content-Type', 'application/json');
      return fetch(`${ForestApi.url}/user/login`,
        {
          method: 'POST',
          headers: loginHeaders,
          signal: signal,
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
        headers.append('Credential', await SecureStore.getItemAsync('CredentialOld'));
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
        headers.append('Credential', await SecureStore.getItemAsync('CredentialOld'));
      }
      return fetch(`${ForestApi.url}${path}`, {
        method: 'POST',
        headers: headers,
        body: body
      });
    }

    static async getFromSam(path){
      let headers = new Headers();
      headers.append('Cookie', await SecureStore.getItemAsync('CredentialNew'));
      headers.append('RequestVerificationToken', await SecureStore.getItemAsync('CredentialNewToken'));
      return fetch(`http://sam.skhu.ac.kr${path}`, {
        method: 'GET',
        headers: headers
      });
    }

    static async postToSam(path, body=null){
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Cookie', await SecureStore.getItemAsync('CredentialNew'));
      headers.append('RequestVerificationToken', await SecureStore.getItemAsync('CredentialNewToken'));
      return fetch(`http://sam.skhu.ac.kr${path}`, {
        method: 'POST',
        headers: headers,
        body: body
      });
    }
}
