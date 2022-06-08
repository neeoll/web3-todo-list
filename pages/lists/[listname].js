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
  const [currentTab, changeTab] = useState('all')
  const [formData, updateForm] = useState()
  const [tasks, updateTasks] = useState([])
  const [permissions, updatePermissions] = useState({})
  const [changesMade, toggleChangesMade] = useState(false)

  useEffect(() => {
    const initialContractLoad = async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(data, TodoList.abi, provider)
      const contractData = await contract.getData()
      const _tasks = []
  
      for (let i = 0; i < contractData[0].length; i++) {
        _tasks.push({
          id: i,
          content: contractData[0][i],
          completed: contractData[1][i],
          new: false,
          changed: false
        })
      }

      updateTasks(_tasks)
  
      const hasAccess = await contract.getWriteStatus({from: window.sessionStorage.getItem('userAddress')})
      const isOwner = await contract.getOwnershipStatus({from: window.sessionStorage.getItem('userAddress')})
      updatePermissions({writeAccess: hasAccess, ownerStatus: isOwner})
    }
    initialContractLoad()
  }, [data])

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

  const checkChanges = (list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].changed == true) {
        return true 
      }
    }
    return false
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
    await contract.grantWriteAccess(formData.address, {from: window.sessionStorage.getItem('userAddress')})
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
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(listAddress, TodoList.abi, signer)
    await contract.saveChanges(changedIds, changedContents, changedStatuses, {from: window.sessionStorage.getItem('userAddress')})
    
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

  const revert = (taskId) => {
    const index = tasks.findIndex(item => {
      return item.id == taskId
    })
    const copy = [...tasks]
    copy[index].completed = !copy[index].completed
    copy[index].changed = false
    
    if (copy[index].new == true) {
      copy.splice(index, 1)
    }
    
    updateTasks(copy)
    toggleChangesMade(checkChanges(copy))
  }

  const addList = async() => {
    if (typeof window.ethereum == 'undefined') return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, Main.abi, signer)
    await contract.addList(formData.address, {from: window.sessionStorage.getItem('userAddress')})
    
    contract.once('Add', async (event) => {
      window.location.reload()
    })
  }

  const toggle = (taskId, completed) => {
    const copy = [...tasks]
    const index = copy.findIndex(item => {
      return item.id == taskId
    })
    copy[index].completed = completed

    if (copy[index].new == false) {
      copy[index].changed = !copy[index].changed
    }
    
    updateTasks(copy)
    toggleChangesMade(checkChanges(copy))
    console.log(tasks)
  }
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className={permissions.writeAccess == true? "card-body": "card-body-blocked"}>
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
                {currentTab == 'all'? 
                  tasks.map(item => (
                    <li key={item.id}>
                      <Task data={item} toggle={toggle} revert={revert}/>
                    </li>
                  )): 
                  currentTab == 'active'?
                  tasks.filter(item => item.completed == false).map(item => (
                    <li key={item.id}>
                      <Task data={item} toggle={toggle} revert={revert}/>
                    </li>
                  )):
                  tasks.filter(item => item.completed == true).map(item => (
                    <li key={item.id}>
                      <Task data={item} toggle={toggle} revert={revert}/>
                    </li>
                  ))
                }
              </div>
              {changesMade == true? 
                <div>
                  <button className="save" onClick={saveChanges}>Save Changes</button>
                  <button className="cancel" onClick={cancelChanges}>Cancel</button>
                </div>:
                null
              }
              <p className="address">Address: {data}</p>
              {permissions.writeAccess === false?
                <button id="addButton" className="save" onClick={addList}>Save this list</button>: 
                null 
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}