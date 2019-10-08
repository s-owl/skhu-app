import * as SecureStore from 'expo-secure-store';
import {AsyncStorage} from 'react-native';

export default class ChunkSecureStore {
  static async setItemAsync(key, value){
    console.log(key, typeof value);
    let strValue = value.toString();
    let byteLength = new Blob([strValue]).size;
    console.log(byteLength);
    let chunkCount = (byteLength >= 2048)? Math.round(byteLength / 2048) : 1;
    let stringChunkSize = Math.round(strValue.length / chunkCount);
    console.log(stringChunkSize);
    let regex = `.{1,${stringChunkSize}}`;
    let chunks = strValue.match(new RegExp(regex, 'g'));
    console.log(chunks);
    await AsyncStorage.setItem(`${key}_count`, chunks.length);
    for(let i=0; i<chunks.length; i++){
      console.log('saving chunk item '+i);
      await SecureStore.setItemAsync(`${key}_item${i}`, chunks[i]);
    }
  }

  static async getItemAsync(key){
    let chunkSize = await AsyncStorage.getItem(`${key}_count`);
    let longValue = '';
    for(let i=0; i<chunkSize; i++){
      let chunk = await SecureStore.getItemAsync(`${key}_item${i}`);
      longValue += chunk;
    }
    return longValue;
  }
}