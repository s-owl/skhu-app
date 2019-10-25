
import BuildConfigs from '../config';
import 'abortcontroller-polyfill';
import moment from 'moment';
import ChunkSecureStore from './chunkSecureStore';

//isJson 은 요청 내용이 json으로 들어오는지 확인한다.
async function isJson(req) {
  let data;
  try {
    if (req.ok) {
      data = await req.json();
    } else {
      data = null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
  return data;
}

// renewSamSession 은 로그인 세션을 새로 갱신하는 함수이다.
async function renewSession(taskType='') {
  const res = await ForestApi.login(
    await ChunkSecureStore.getItemAsync('userid'),
    await ChunkSecureStore.getItemAsync('userpw'),
    taskType
  );

  if (res.ok) {
    let tokens = await res.json();
    switch(taskType){
    case 'credentialOld': 
      await ChunkSecureStore.setItemAsync('CredentialOld', tokens['credential-old']);
      break;
    case 'credentialNew':
      await ChunkSecureStore.setItemAsync('CredentialNew', tokens['credential-new']);
      await ChunkSecureStore.setItemAsync('CredentialNewToken', tokens['credential-new-token']);
      break;
    default:
      await ChunkSecureStore.setItemAsync('CredentialOld', tokens['credential-old']);
      await ChunkSecureStore.setItemAsync('CredentialNew', tokens['credential-new']);
      await ChunkSecureStore.setItemAsync('CredentialNewToken', tokens['credential-new-token']);
    }
    await ChunkSecureStore.setItemAsync('sessionUpdatedAt', moment().utc().format());
  }
}

// getSamFetcher 쿠키를 시간에 따라 처리하기 위해 클로져로
// Fetch를 호출하고 결과를 리턴한다.
function getSamFetcher(path, method, jsonBody=undefined) {
  return async()=> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Cookie', await ChunkSecureStore.getItemAsync('CredentialNew'));
    headers.append('RequestVerificationToken', await ChunkSecureStore.getItemAsync('CredentialNewToken'));
    let req = {
      method: method,
      headers: headers
    };

    if (!['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(method.toUpperCase())) req.body = jsonBody;
    
    return fetch(`http://sam.skhu.ac.kr${path}`, req);
  };
}

// runFetcher 는 Fetcher를 실제로 작동시키고 실패 시 로그인 시도 후 한 번만 더 실행한다.
async function runFetcher(fetcher) {
  let data = await isJson(await fetcher());
  if (data == null) {
    await renewSession('credentialNew');
    data = await isJson(await fetcher());
  }
  return data;
}


export default class ForestApi{
  static url = BuildConfigs.API_SERVER_ADDR;
  static login(userid, userpw, taskType=undefined){

    let taskTypeParam = '';
    switch(taskType){
    case 'credentialOld':
      taskTypeParam = 'credential-old';
      break;
    case 'credentialNew':
      taskTypeParam = 'credential-new';
      break;
    default:
      taskTypeParam = '';
    }

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
          userid: userid.toString(),
          userpw: userpw.toString(),
          type: taskTypeParam
        })
      });
  }

  static async get(path, withCredential){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(withCredential){
      headers.append('Credential', await ChunkSecureStore.getItemAsync('CredentialOld'));
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
      headers.append('Credential', await ChunkSecureStore.getItemAsync('CredentialOld'));
    }
    return fetch(`${ForestApi.url}${path}`, {
      method: 'POST',
      headers: headers,
      body: body
    });
  }

  static async getFromSam(path){
    const fetcher = getSamFetcher(path, 'GET');
    let data = await runFetcher(fetcher);
    return data;
  }

  static async postToSam(path, body=undefined){
    const fetcher = getSamFetcher(path, 'POST', body);
    let data = await runFetcher(fetcher);
    return data;
  }

  static async getCredentialOld(){
    return ChunkSecureStore.getItemAsync('CredentialOld');
  }
}
