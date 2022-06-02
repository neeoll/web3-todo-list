import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TodoList from '../../artifacts/contracts/TodoList.sol/TodoList.json'
import Task from '../components/Task'

export function getServerSideProps(context) {
  return {
    props: {
      data: context.query.address
    }
  }
}

export default function Todo({ data }) {

  const listAddress = data
  
  const [formData, updateForm] = useState()
  const [changesMade, toggleChangesMade] = useState(false)
  const [tasks, updateTasks] = useState([])
  const [permissions, updatePermissions] = useState({})

  const initialContractLoad = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(listAddress, TodoList.abi, provider)
      const contractData = await contract.getData()
      const tasks = []
  
      for (let i = 0; i < contractData[0].length; i++) {
        const task = {
          id: i,
          content: contractData[0][i],
          completed: contractData[1][i],
          new: false,
          changed: false
        }
        console.log(task)
        tasks.push(task)
      }
      updateTasks(tasks)
  
      const hasAccess = await contract.getWriteStatus({from: window.sessionStorage.getItem('userAddress')})
      const isOwner = await contract.getOwnershipStatus({from: window.sessionStorage.getItem('userAddress')})
      updatePermissions({...permissions, writeAccess: hasAccess, ownerStatus: isOwner})
    }

  useEffect(() => {
    initialContractLoad()
  }, [])

  async function saveChanges() {
    if (typeof window.ethereum == 'undefined') return
    try {
      const changedIds = []
      const changedContents = []
      const changedStatuses = []

      tasks.forEach((item) => {
        if (item.changed == true) {
          changedIds.push(item.id)
          changedContents.push(item.content)
          changedStatuses.push(item.completed)
        }
      })
      
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const contract = new ethers.Contract(listAddress, TodoList.abi, signer)
      await contract.saveChanges(changedIds, changedContents, changedStatuses, {from: window.sessionStorage.getItem('userAddress')})
      
      contract.once('ChangesSaved', async (event) => {
        toggleChangesMade(false)
      })
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

  async function modifyWriteAccess() {
    if (typeof window.ethereum == 'undefined') return
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const contract = new ethers.Contract(listAddress, TodoList.abi, signer)
      await contract.grantWriteAccess(formData.address, {from: window.sessionStorage.getItem('userAddress')})
      
      contract.once('WriteAccessModified', async (addr, event) => {
        console.log(`${addr} now has write access`)
      })
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

  function cancelChanges() {
    const filteredTasks = tasks.filter(each => !each.new)
    filteredTasks.forEach((item) => {
      if (item.changed) {
        item.completed = !item.completed
      }
    })
    updateTasks(filteredTasks)
    console.log(tasks)
    toggleChangesMade(false)
  }

  function addTask(e) {
    e.preventDefault()
    const _task = {
      id: tasks.length,
      content: formData.name,
      completed: false,
      new: true,
      changed: true
    }
    
    updateTasks([...tasks, _task])
    toggleChangesMade(true)
  }

  const toggleCompletion = async(taskId, completed) => {
    tasks[taskId].completed = completed
    if (tasks[taskId].new != true) {
      tasks[taskId].changed = !tasks[taskId].changed
    }

    console.log(tasks[taskId])
    
    toggleChangesMade(true)
  }

  function handleKeyPress(e) {
    if (e.keyCode == 13) { 
      if (document.activeElement.name == 'taskName') {
        addTask(e) 
      } else {
        modifyWriteAccess(e)
      }
      document.activeElement.value = ''
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form>
                <input type="text" onKeyDown={handleKeyPress} className="form-control add-task" placeholder="New Task" name="taskName" onChange={e => updateForm({...formData, name: e.target.value})}/>
                {
                  permissions.ownerStatus === true
                  ? <input type="text" onKeyDown={handleKeyPress} className="form-control add-task" placeholder="Address to Grant Write Access" name="newAddress" onChange={e => updateForm({...formData, address: e.target.value})}/>
                  : null
                }
              </form>
              {/* <ul className="nav nav-pills todo-nav">
                <li role="presentation" className="nav-item all-task active"><a href="#" className="nav-link">All</a></li>
                <li role="presentation" className="nav-item active-task"><a href="#" className="nav-link">Active</a></li>
                <li role="presentation" className="nav-item completed-task"><a href="#" className="nav-link">Completed</a></li>
              </ul> */}
              <div className="card-list">
                {tasks.map(item => (
                  <li key={item.id}>
                    <Task id={item.id} contents={item.content} completed={item.completed} toggle={toggleCompletion}/>
                  </li>
                ))}
              </div>
              {changesMade == true? 
                <div>
                  <button className="save" onClick={saveChanges}>Save Changes</button>
                  <button className="cancel" onClick={cancelChanges}>Cancel</button>
                </div>:
                null
              }
              <p className="address">Address: {listAddress}</p>
              { permissions.writeAccess === false ? <div id="blocker" /> : null }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}