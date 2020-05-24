export const isDevelopmentEnvironment = () =>
  process && process.env.NODE_ENV === "development";

export const isProductionEnvironment = () =>
  process && process.env.NODE_ENV === 'production';

export const isMacOSEnvironment = () =>
  process && process.platform === "darwin";

export const isWinOSEnvironment = () =>
  process && process.platform === 'win32';

export default {
  isDevelopmentEnvironment,
  isProductionEnvironment,
  isMacOSEnvironment,
  isWinOSEnvironment
}
