/**
 * @usePlayMedia used to play video, audio media elements onClick
 * */

import { useState, useEffect } from 'react'

export const usePlayMedia = (initialState = false, mediaElementRef) => {
  const [showMedia, setShowMedia] = useState(() => initialState)

  const handlePlayMedia = e => {
    e.stopPropagation()
    setShowMedia(true)
  }

  useEffect(() => {
    if (showMedia) {
      mediaElementRef.current.play()
    }
  }, [showMedia])

  return [showMedia, handlePlayMedia]
}

export default usePlayMedia
