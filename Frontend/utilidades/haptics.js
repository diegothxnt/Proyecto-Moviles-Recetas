import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const vibrarLigero = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

export const vibrarMedio = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};

export const vibrarExito = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {}
  );
};

export const vibrarError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {}
  );
};

export const vibrarAdvertencia = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
    () => {}
  );
};

export const vibrarSeleccion = () => {
  Haptics.selectionAsync().catch(() => {});
};