import * as SecureStore from 'expo-secure-store';
import {AsyncStorage} from 'react-native';

export default class ChunkSecureStore {
  static async setItemAsync(key, value){
    let strValue = `${value}`;
    let byteLength = new Blob([strValue]).size;
    let chunkCount = (byteLength >= 2048)? Math.ceil(byteLength / 2048) : 1;
    let stringChunkSize = Math.round(strValue.length / chunkCount);
    let regex = `.{1,${stringChunkSize}}`;
    let chunks = strValue.match(new RegExp(regex, 'g'));
    await AsyncStorage.setItem(`${key}_count`, chunks.length.toString());
    for(let i=0; i<chunks.length; i++){
      await SecureStore.setItemAsync(`${key}_item${i}`, chunks[i]);
    }
  }

  static async getItemAsync(key){
    let chunkSize = Number(await AsyncStorage.getItem(`${key}_count`));
    let longValue = '';
    for(let i=0; i<chunkSize; i++){
      let chunk = await SecureStore.getItemAsync(`${key}_item${i}`);
      longValue += chunk;
    }
    return longValue;
  }
}