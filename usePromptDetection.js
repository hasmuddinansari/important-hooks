import React, { useEffect, useState } from 'react'
import { Prompt } from 'react-router-dom'
import { bool, object, string } from 'prop-types'

import { deepDifference, hasValue } from 'utils'
import { PROMPT_MESSAGE } from 'global-constants'

export const usePromptDetection = ({
  isSaved,
  currentChanges,
  oldChanges,
  promptMessage,
}) => {
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    if (isSaved) {
      setIsChanged(false)
    } else {
      const checkDiff = deepDifference(currentChanges, oldChanges)
      setIsChanged(hasValue(checkDiff))
    }
  }, [currentChanges, oldChanges, isSaved])

  return <Prompt when={isChanged} message={promptMessage || PROMPT_MESSAGE} />
}

usePromptDetection.propTypes = {
  isSaved: bool,
  currentChanges: object,
  oldChanges: object,
  promptMessage: string,
}
