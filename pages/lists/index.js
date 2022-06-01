import { useRouter } from 'next/router'
import List from '../components/List'
import { useState, useEffect } from 'react'
import Main from '../../artifacts/contracts/Main.sol/Main.json'
import { ethers } from 'ethers'
import { contractAddress } from '../../config'

export default function Lists() {

  const [lists, updateLists] = useState([])
  const router = useRouter()

  useEffect(() => {
    const getLists = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, Main.abi, provider)
      const contractData = await contract.getLists({from: window.sessionStorage.getItem('userAddress')})
      
      updateLists(contractData)
    }
    getLists()
  }, [])

  function createRoute() { router.push('create_list') }
  function addRoute() { router.push('add_list') }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <button className="save" onClick={createRoute}>Create New List</button> 
              <button className="save" onClick={addRoute}>Add List By Address</button> 
              <div className="card-list">
                { lists.length == 0 ? <h4>You currently have no lists, time to make one!</h4> : null }
                { lists.map(item => (
                  <li key={item}>
                    <List address={item} />
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
