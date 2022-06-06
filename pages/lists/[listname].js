import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TodoList from '../../artifacts/contracts/TodoList.sol/TodoList.json'
import Task from '../components/Task'
import { useRouter } from 'next/router'

export function getServerSideProps(context) {
  return {
    props: {
      data: context.query.address
    }
  }
}

export default function Todo({ data }) {
  const listAddress = data
  const userAddress = window.sessionStorage.getItem('userAddress')
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const checkChanges = (list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].changed == true) {
        return true 
      }
    }
    return false
  }

  const [currentTab, changeTab] = useState('all')
  const [formData, updateForm] = useState()
  const [tasks, updateTasks] = useState([])
  const [permissions, updatePermissions] = useState({})
  const [changesMade, toggleChangesMade] = useState(false)

  const initialContractLoad = async () => {
    const contract = new ethers.Contract(listAddress, TodoList.abi, provider)
    const contractData = await contract.getData()
    const tasks = []

    for (let i = 0; i < contractData[0].length; i++) {
      tasks.push({
        id: i,
        content: contractData[0][i],
        completed: contractData[1][i],
        new: false,
        changed: false
      })
    }
    updateTasks(tasks)

    const title = await contract.getTitle()
    const hasAccess = await contract.getWriteStatus({from: userAddress})
    const isOwner = await contract.getOwnershipStatus({from: userAddress})
    updatePermissions({...permissions, writeAccess: hasAccess, ownerStatus: isOwner})
    setTitle(title)
  }

  useEffect(() => {
    initialContractLoad()
  }, [])

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) { 
      if (document.activeElement.name == 'taskName') {
        addTask(e) 
      } else {
        modifyWriteAccess(e)
      }
      document.activeElement.value = ''
    }
  }

  const addTask = (e) => {
    e.preventDefault()
    updateTasks([...tasks, {
      id: tasks.length,
      content: formData.name,
      completed: false,
      new: true,
      changed: true
    }])
    if (!changesMade) toggleChangesMade(true)
  }

  const modifyWriteAccess = async(e) => {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    const signer = provider.getSigner()
    const contract = new ethers.Contract(listAddress, TodoList.abi, signer)
    await contract.grantWriteAccess(formData.address, {from: userAddress})
  }

  const saveChanges = async() => {
    if (typeof window.ethereum == 'undefined') return
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
    
    const signer = provider.getSigner()
    const contract = new ethers.Contract(listAddress, TodoList.abi, signer)
    await contract.saveChanges(changedIds, changedContents, changedStatuses, {from: userAddress})
    
    contract.once('ChangesSaved', async (event) => {
      toggleChangesMade(false)
    })
  }

  const cancelChanges = () => {
    const filteredTasks = tasks.filter(each => !each.new)
    filteredTasks.forEach((item) => {
      if (item.changed) {
        item.completed = !item.completed
        item.changed = false
      }
    })
    updateTasks(filteredTasks)
    toggleChangesMade(false)
  }

  const revertTask = (taskId) => {
    const index = tasks.findIndex(item => {
      return item.id == taskId
    })
    tasks[index].completed = !tasks[index].completed
    tasks[index].changed = false

    const filteredTasks = () => {
      if (tasks[index].new == true) {
        const temp = tasks.filter(item => {
          return item.id != taskId
        })
        return temp
      } else {
        return tasks
      }
    }
    
    updateTasks(filteredTasks)
    toggleChangesMade(checkChanges(filteredTasks))
  }

  const addList = () => {
    if (typeof window.ethereum == 'undefined') return
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, Main.abi, signer)
    await contract.addList(formData.address, {from: userAddress})
    
    contract.once('Add', async (event) => {
      window.location.reload()
    })
  }

  const toggleCompletion = (taskId) => {
    const index = tasks.findIndex(item => {
      return item.id == taskId
    })
    tasks[index].completed = !tasks[index].completed

    if (tasks[index].new == false) {
      tasks[index].changed = !tasks[index].changed
    }
    console.log(tasks[index])
    toggleChangesMade(checkChanges(tasks))
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
              <ul className="nav nav-pills todo-nav">
                <li className='list-tab'><a className='nav-link' onClick={() => changeTab('all')}>All</a></li>
                <li className='list-tab'><a className='nav-link' onClick={() => changeTab('active')}>Active</a></li>
                <li className='list-tab'><a className='nav-link' onClick={() => changeTab('completed')}>Completed</a></li>
              </ul>
              <div className="card-list">
                {tasks.map(item => (
                  <li key={item.id}>
                    <Task data={item} toggle={toggleCompletion} revert={revertTask}/>
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
              {permissions.writeAccess === false?
                <>
                  <div id='blocker' />
                  <div className='allow'>
                    <button className="save" onClick={addList}>Save this list</button>
                  </div>
                </>: 
                null 
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}