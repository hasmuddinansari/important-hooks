/* eslint-disable */
import { useEffect, useState } from 'react'
import localForage from 'localforage'
import { MediaError } from 'utils'
import { useMediaPermission } from './useMediaPermission'
/**
 * Documentation
 *
 * @description useMediaRecorder is custom hook Returns media recording functionalities
 *
 * @param {string}   recordingType
 * @param {string}   format
 * @param {object}   constraints
 * @param {HTMLElement}   ref
 * @param {string}   localForageKey
 *
 * @returns {string} recordingType
 * @returns {MediaStream} previewStream
 * @returns {MediaDevices} devices
 * @returns {MediaDevices} audioDevices
 * @returns {MediaDevices} videoDevices
 * @returns {Function} startRecording
 * @returns {Function} stopRecording
 * @returns {Boolean} isRecording
 * @returns {Blob} mediaBlob
 * @returns {Blob} mediaBlobUrl
 * @returns {string} error: err
 */

window.stream = null

const mediaDevices =
  navigator.mediaDevices ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

const RECORDING = 'recording'
const VIDEO_AND_AUDIO = 'video_audio'
const AUDIO_ONLY = 'audio'
const VIDEO_ONLY = 'video'

let chunks = []
let file = null
let isRef = false

export const useMediaRecorder = ({
  recordingType: type,
  format,
  constraints,
  ref,
  localForageKey,
}) => {
  isRef = Boolean(ref)
  const recordingType = type
  const mediaElement = ref
  const defaultConstraints = constraints
    ? constraints
    : {
        audio:
          recordingType === VIDEO_AND_AUDIO || recordingType === AUDIO_ONLY
            ? {
                echoCancellation: { exact: true },
              }
            : false,
        video:
          recordingType === VIDEO_AND_AUDIO || recordingType === VIDEO_ONLY
            ? {
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
              }
            : false,
      }

  const {
    audioDevices,
    videoDevices,
    allDevices,
    error,
    permissions,
  } = useMediaPermission()

  const [mediaBlobUrl, setMediaBlobUrl] = useState(null)
  const [mediaBlob, setMediaBlob] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [err, setErr] = useState(() => error)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [previewStream, setPreviewStream] = useState(null)

  const getStream = async () => {
    try {
      if (!MediaRecorder || !mediaDevices.getUserMedia) {
        throw Error('Unsupported Browser')
      }
      const mediaStream = await mediaDevices.getUserMedia(defaultConstraints)
      if (ref) {
        mediaElement.srcObject = mediaStream
        mediaElement.onloadedmetadata = () => {
          mediaElement.play()
        }
      }
      setPreviewStream(mediaStream)
      window.stream = mediaStream
    } catch (err) {
      const mediaError = new MediaError(err)
      setErr(mediaError.message)
    }
  }

  const changeDevice = ({ audioDevice, videoDevice }) => {
    /* Clear Existing stream */
    clearStream()
    /* Update Device Id */
    if (audioDevice) {
      defaultConstraints.audio = {}
      defaultConstraints.audio.deviceId = audioDevice
    }
    if (videoDevice) {
      defaultConstraints.video.deviceId = videoDevice
    }

    /* Get Stream again */
    getStream()
  }

  const startRecording = () => {
    chunks = []
    let options = { mimeType: format }
    if (window.stream) {
      const recorder = new MediaRecorder(window.stream, options)
      setMediaRecorder(recorder)
      setIsRecording(true)
      recorder.ondataavailable = e => {
        chunks.push(e.data)
      }
      recorder.start(100)
    }
  }

  const stopRecording = async () => {
    const blob = new Blob(chunks, { type: format })
    file = blob
    if (mediaRecorder.state === RECORDING) {
      mediaRecorder.stop()
    }
    if (localForageKey) {
      const [_, extension] = format.split('/')
      const localForageItem = { extension, blob }
      await localForage.setItem(localForageKey, localForageItem)
      setMediaBlob(
        Object.assign(blob, {
          preview: URL.createObjectURL(blob),
        }),
      )
    }
    const url = URL.createObjectURL(blob)
    setMediaBlob(blob)
    setMediaBlobUrl(url)
    setMediaRecorder(null)
    setPreviewStream(null)
    setIsRecording(false)
    clearStream()
  }

  const clearStream = () => {
    if (window.stream) {
      stopStreamedVideo(window.stream)
      stopStreamedVideo(mediaElement?.srcObject?.stream, mediaElement)
      window.stream = null
    }

    if (file) {
      URL.revokeObjectURL(file)
      file = null
    }
  }

  const stopStreamedVideo = (stream, videoElem) => {
    try {
      const tracks = stream.getTracks()

      tracks.forEach(track => {
        track.stop()
      })

      if (videoElem) {
        videoElem.srcObject = null
      }
    } catch {}
  }

  useEffect(() => {
    if (isRef) {
      getStream()
    }
  }, [isRef])

  useEffect(() => {
    const { audio, video } = permissions ?? {}
    const permit = audio || video
    if (permit) {
      getStream()
    }

    return () => {
      clearStream()
    }
  }, [permissions?.audio, permissions?.video])

  return {
    recordingType,
    isRecording,
    mediaBlob,
    mediaBlobUrl,
    previewStream,
    error: err,
    devices: allDevices,
    audioDevices,
    videoDevices,
    startRecording,
    stopRecording,
    changeDevice,
    mediaBlob,
    clearStream,
  }
}

export default useMediaRecorder
