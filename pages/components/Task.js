import { useState, useEffect } from 'react'

export default function Task({data, toggle, revert}) {
  const [propsData, updateProps] = useState(data)

  const toggleCompletion = () => {
    toggle(propsData.id, !propsData.completed)
  }
  
  const revertTask = () => {
    revert(propsData.id)
  }

  useEffect(() => {
    updateProps(data)
  }, [data])

  return(
    <div className="card-item">
      <div className="checker"><span className=""><input type="checkbox" onChange={toggleCompletion} checked={propsData.completed}/></span></div>
      <span className={propsData.completed == true? "completed-content": null}>{propsData.content}</span>
      {propsData.changed === true?
        <button className="cancel" onClick={revertTask}>Revert</button>:
        null
      }
    </div>
  )
}