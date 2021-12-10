import { Colors } from "./types";

export const baseColors = {
  failure: "#EF9A9A",
  primary: "#1FC7D4",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
  warning: "#FFB237",
};

export const brandColors = {
  binance: "#F0B90B",
};

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  text: "#452A7A",
  textDisabled: "#BDC2C4",
  textSubtle: "#8f80ba",
  borderColor: "#E9EAEB",
  backgroundGradient:
    "radial-gradient(106.46% 161.43% at 1.69% 50%, rgba(165, 156, 249, 0.2) 0%, rgba(21, 0, 233, 0.032) 77.08%, rgba(21, 0, 233, 0) 100%), #0D0D18",
};

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: "#9A6AFF",
  background: "#0D0D18",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "linear-gradient(96deg, #FFFFFF 0%, #E2653D 100%)",
  backgroundGradient:
    "radial-gradient(106.46% 161.43% at 1.69% 50%, rgba(165, 156, 249, 0.2) 0%, rgba(21, 0, 233, 0.032) 77.08%, rgba(21, 0, 233, 0) 100%), #0D0D18",
  primaryDark: "#0098A1",
  text: "#FFFFFF",
  textDisabled: "#BDC2C4",
  textSubtle: "#F2F2F2",
  borderColor: "#E9EAEB",
};
