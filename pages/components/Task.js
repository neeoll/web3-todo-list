import { useState } from "react"

export default function Task(props) {

  const [propsData, updateProps] = useState(props.data);

  const toggle = () => {
    props.toggle(propsData.id)
  }
  
  const revert = () => {
    props.revert(propsData.id)
  }

  return(
    <div className="card-item">
      <div className="checker"><span className=""><input type="checkbox" onChange={toggle} checked={propsData.completed}/></span></div>
      <span className={propsData.completed == true? "completed-content": null}>{propsData.content}</span>
      {propsData.changed === true?
        <button onClick={revert}>Revert</button>:
        null
      }
    </div>
  )
}