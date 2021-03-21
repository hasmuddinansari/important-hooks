import { useState, useEffect, useMemo } from 'react'
import { MediaError, hasValue } from 'utils'

const devicesList = [
  {
    name: 'camera',
    deviceKind: 'videoinput',
    deviceType: 'video',
  },
  {
    name: 'microphone',
    deviceKind: 'audioinput',
    deviceType: 'audio',
  },
]

const deviceFilterBy = (devices = [], deviceKind) => {
  try {
    return devices.filter(({ kind }) => kind === deviceKind)
  } catch {
    return []
  }
}

const mediaDevices =
  navigator.mediaDevices ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

export const useMediaPermission = () => {
  const [state, setState] = useState({
    allDevices: [],
    audio: [],
    video: [],
    error: null,
    permissions: {},
  })

  const setDevicesInState = async ({
    deviceType,
    deviceKind,
    deviceBlank = false,
    allow = false,
  }) => {
    try {
      const devices = await mediaDevices.enumerateDevices()
      const list = deviceBlank ? [] : deviceFilterBy(devices, deviceKind)

      setState(prevState => ({
        ...prevState,
        [deviceType]: list,
        permissions: { ...prevState.permissions, [deviceType]: allow },
        allDevices: devices,
      }))
    } catch (err) {
      const mediaError = new MediaError(err)
      setState(prevState => ({ ...prevState, error: mediaError.message }))
    }
  }

  const getPermission = ({ name, deviceType, deviceKind }) => {
    navigator.permissions.query({ name }).then(response => {
      if (!hasValue(state?.[deviceType])) {
        setDevicesInState({
          deviceType,
          deviceKind,
        })
      }
      response.onchange = ({ type, target }) => {
        /* detecting if the event is a change */
        if (type === 'change') {
          /* checking what the new permissionStatus state is */
          const newState = target.state
          switch (newState) {
            case 'denied':
              setDevicesInState({
                deviceType,
                deviceKind,
                deviceBlank: true,
                allow: false,
              })
              break
            default:
              setDevicesInState({
                deviceType,
                deviceKind,
                allow: newState === 'granted',
              })
          }
        }
      }
    })
  }

  const resetState = () => {
    if (hasValue(state.permissions)) {
      setState({
        allDevices: [],
        audio: [],
        video: [],
        error: null,
        permissions: {},
      })
    }
  }

  useEffect(() => {
    devicesList.forEach(getPermission)
  }, [])

  const devicesData = useMemo(
    () => ({
      ...state,
      audioDevices: state.audio,
      videoDevices: state.video,
      resetState,
    }),
    [state],
  )

  return devicesData
}
