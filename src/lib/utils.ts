/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});
//@ts-ignore
export const onCloseApp = () => window.ipcRenderer.send("closeApp");
export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpsClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const getMediaSources = async () => {
  //@ts-ignore
  const displays = await window.ipcRenderer.invoke("getSources");
  const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
  const audioInput = enumerateDevices.filter(
    (device) => device.kind === "audioinput"
  );
  console.log("getting");
  return { displays, audio: audioInput };
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const response = await httpsClient.post(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
export const hidePluginWindow = (state: boolean) => {
  //@ts-ignore
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hour = Math.floor((ms / 1000 / 60 / 60) % 60)
    .toString()
    .padStart(2, "0");
  return { length: `${hour}:${minute}:${second}`, minute };
};

export const resizeWindow = (shrink: boolean) => {
  //@ts-ignore
  window.ipcRenderer.send("resize-studio", { shrink });
};
