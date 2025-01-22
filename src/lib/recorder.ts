import React from "react";
import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

// Global variables
let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder;
let userId: string;

// Socket connection
const socket = io(import.meta.env.VITE_SOCKET_URL as string);

// Start recording function
export const StartRecording = (onSources: {
    screen: string;
    audio: string;
    id: string;
}) => {
    if (!onSources || !onSources.id || !onSources.screen) {
        console.error("Invalid sources provided for recording.");
        return;
    }

    hidePluginWindow(true);

    // Generate unique filename for the recorded video
    videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;

    // Start the MediaRecorder
    if (mediaRecorder) {
        mediaRecorder.start(1000); // Collect chunks every second
    } else {
        console.error("MediaRecorder is not initialized.");
    }
};

// Stop recording function
export const onStopRecording = () => {
    hidePluginWindow(false);

    if (mediaRecorder) {
        mediaRecorder.stop();
    } else {
        console.error("MediaRecorder is not active.");
    }
};

// MediaRecorder stop event handler
const stopRecording = () => {
    hidePluginWindow(false);

    if (videoTransferFileName && userId) {
        socket.emit("process-video", {
            filename: videoTransferFileName,
            userId,
        });
    } else {
        console.error("Missing video filename or user ID.");
    }
};

// MediaRecorder data available event handler
export const onDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0 && videoTransferFileName) {
        socket.emit("video-chunks", {
            chunks: e.data,
            filename: videoTransferFileName,
        });
    } else {
        console.error("No data available or filename is missing.");
    }
};

// Select sources for screen and audio recording
export const selectSources = async (
    onSources: {
        screen: string;
        audio: string;
        id: string;
        preset: "HD" | "SD";
    },
    videoElement: React.RefObject<HTMLVideoElement>
) => {
    if (!onSources || !onSources.screen || !onSources.audio || !onSources.id) {
        console.error("Invalid sources provided.");
        return;
    }

    const constraints: any = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: onSources.screen,
                minWidth: onSources.preset === "HD" ? 1920 : 1280,
                maxWidth: onSources.preset === "HD" ? 1920 : 1280,
                minHeight: onSources.preset === "HD" ? 1080 : 720,
                maxHeight: onSources.preset === "HD" ? 1080 : 720,
                frameRate: 30,
            },
        },
    };

    userId = onSources.id;

    try {
        // Create screen video stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Create audio stream if audio is enabled
        const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: onSources.audio
                ? { deviceId: { exact: onSources.audio } }
                : false,
        });

        // Assign the screen video stream to the video element
        if (videoElement && videoElement.current) {
            videoElement.current.srcObject = stream;
            videoElement.current.muted = true;
            await videoElement.current.play();
        }

        // Combine video and audio tracks into a single MediaStream
        const combineStream = new MediaStream([
            ...stream.getTracks(),
            ...audioStream.getTracks(),
        ]);

        // Initialize the MediaRecorder
        mediaRecorder = new MediaRecorder(combineStream, {
            mimeType: "video/webm; codecs=vp9",
        });

        mediaRecorder.ondataavailable = onDataAvailable;
        mediaRecorder.onstop = stopRecording;
    } catch (error: any) {
        console.error("Error selecting sources:", error);
        // @ts-ignore
        console.error(error.message);
    }
};
