import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_KEY = 'unique_device_id';

export async function getDeviceId(): Promise<string> {
  let id = await SecureStore.getItemAsync(DEVICE_KEY);
  if (!id) {
    id = uuidv4();
    await SecureStore.setItemAsync(DEVICE_KEY, id);
  }
  return id;
}
