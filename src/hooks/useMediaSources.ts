import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react";

export type SourceDeviceStateProps = {
  displays?: {
    appIcons: null;
    display: null;
    displayId: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInput?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending: boolean;
};

type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourceDeviceStateProps;
};

export const useMediaSources = () => {
  const [state, dispatch] = useReducer(
    (state: SourceDeviceStateProps, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    {
      displays: [],
      audioInput: [],
      error: null,
      isPending: false,
    }
  );

  const fetchMediaResources = () => {
    dispatch({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaSources()
      .then((sources) => {
        dispatch({
          type: "GET_DEVICES",
          payload: {
            displays: sources.displays,
            audioInput: sources.audio,
            isPending: false,
          },
        });
      })
      .catch((error) => {
        console.error("Failed to fetch media sources:", error);
        dispatch({
          type: "GET_DEVICES",
          payload: { error: error.message, isPending: false },
        });
      });
  };

  return { state, fetchMediaResources };
};