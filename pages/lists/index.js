import { useRouter } from 'next/router'
import List from '../components/List'
import { useState, useEffect } from 'react'
import Main from '../../artifacts/contracts/Main.sol/Main.json'
import TodoList from '../../artifacts/contracts/TodoList.sol/TodoList.json'
import { ethers } from 'ethers'
import { contractAddress } from '../../config'

export default function Lists() {

  const [lists, updateLists] = useState([])
  const [creatingList, toggleCreating] = useState(false)
  const [addingList, toggleAdding] = useState(false)
  const [formData, fillForm] = useState()
  const router = useRouter()

  useEffect(() => {
    const getLists = async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, Main.abi, provider)
      const contractData = await contract.getLists({from: window.sessionStorage.getItem('userAddress')})
      const _lists = []
      
      for (let i = 0; i < contractData.length; i++) {
        _lists.push({id: i, address: contractData[i]})
      }

      updateLists(_lists)
    }
    getLists()
  }, [])

  const listRoute = (listName, listAddr) => {
    const slug = listName.replace(/\s/g, '-')
    router.push({ 
      pathname: `lists/${slug}`, 
      query: { address: listAddr }
    }, `lists/${slug}`)
  }

  const contractCreate = async(e) => {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = new ethers.Contract(contractAddress, Main.abi, signer)
    await contract.createList(formData, {from: window.sessionStorage.getItem('userAddress')})
    
    contract.once('Create', async (contractAddr, event) => {
      const slug = formData.replace(/\s/g, '-')
      router.push({ 
        pathname: `lists/${slug}`, 
        query: { address: contractAddr }
      }, `lists/${slug}`)
    })
  }

  const routeToList = async(e) => {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(formData, TodoList.abi, provider)
    const title = await contract.getTitle()
    const slug = title.replace(/\s/g, '-')
    router.push({ 
      pathname: `lists/${slug}`, 
      query: { address: formData }
    }, `lists/${slug}`)
  }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) { 
      if (document.activeElement.name == 'listName') {
        contractCreate(e) 
      } else {
        routeToList(e)
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
              <button className="save" onClick={() => { toggleCreating(true), toggleAdding(false) }}>Create New List</button>
              <button className="save" onClick={() => { toggleAdding(true), toggleCreating(false) }}>Add List By Address</button>
              {creatingList == true?
                <form>
                  <input className="form-control add-task" onKeyDown={handleKeyPress} type="text" placeholder="Name" name="listName" onChange={e => fillForm(e.target.value)} required/>
                </form>:
                null
              }
              {addingList == true?
                <form>
                  <input className="form-control add-task" onKeyDown={handleKeyPress} type="text" placeholder="Address" name="listAddress" onChange={e => fillForm(e.target.value)} required/>
                </form>:
                null
              }
              <div className="card-list">
                { lists.length == 0 ? <h4>{"You don't have any lists, time to make one!"}</h4> : null }
                { lists.map(item => (
                  <li key={item.id}>
                    <List address={item.address} route={listRoute}/>
                  </li>
                )) }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
