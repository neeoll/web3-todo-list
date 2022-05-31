import { useEffect, useState } from "react"

export default function Task(props) {

  const [propsData, updateProps] = useState(props);

  async function toggle() {
    await props.toggle(props.id, !propsData.completed)
    updateProps({...propsData, completed: !propsData.completed})
  }

  useEffect(() => {
    updateProps(props)
  }, [props])

  return(
    <div class="card-item">
      <div class="checker"><span class=""><input type="checkbox" onChange={toggle} checked={propsData.completed}/></span></div>
      <span> {propsData.contents}</span>
    </div>
  )
 
}