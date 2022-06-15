import { useState, useEffect } from 'react'
import { DividerHorizontalIcon, CheckIcon } from '@radix-ui/react-icons'
import { StyledCardItem, StyledButton } from '../../Primitives'
import * as Checkbox from '@radix-ui/react-checkbox'
import { styled } from '@stitches/react'
import { violet } from '@radix-ui/colors'

export default function Task({data, toggle, revert}) {
  const [propsData, updateProps] = useState(data)
  useEffect(() => {
    updateProps(data)
  }, [data])

  const [checked, setChecked] = useState('indeterminate')
  useEffect(() => {
    if (propsData.completed == true) {
      setChecked(true)
      return
    }
    setChecked('indeterminate')
  }, [propsData.completed])

  const toggleCompletion = () => { toggle(propsData.id, !propsData.completed) }
  const revertTask = () => { revert(propsData.id) }

  return(
    <StyledCardItem>
      <StyledCheckbox checked={checked} onCheckedChange={toggleCompletion}>
        <StyledIndicator>
          {checked === 'indeterminate' && <DividerHorizontalIcon />}
          {checked === true && <CheckIcon />}
        </StyledIndicator>
      </StyledCheckbox>
      <StyledContent completed={propsData.completed}>{propsData.content}</StyledContent>
      { propsData.changed === true && <StyledButton type={'cancel'} onClick={revertTask}>Revert</StyledButton> }
    </StyledCardItem>
  )
}

const StyledCheckbox = styled(Checkbox.Root, {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '10px',
  width: 'auto',
  height: 'auto',
  border: 'none',
  borderRadius: '5px'
})

const StyledIndicator = styled(Checkbox.Indicator, {
  color: violet.violet11,
})

const StyledContent = styled('span', {
  marginRight: 10,
  variants: {
    completed: {
      true: {
        textDecoration: 'line-through'
      }
    }
  }
})