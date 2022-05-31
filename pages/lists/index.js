import { useRouter } from 'next/router'
import List from '../components/List'
import { useState, useEffect } from 'react'
import Main from '../../artifacts/contracts/Main.sol/Main.json'
import { ethers } from 'ethers'
import { contractAddress } from '../../config'

export default function Lists() {

  const [lists, updateLists] = useState([])
  const router = useRouter()

  const getLists = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, Main.abi, provider)
    const contractData = await contract.getLists({from: window.sessionStorage.getItem('userAddress')})
    
    updateLists(contractData)
  }

  useEffect(() => {
    getLists()
  }, [])

  function createRoute() { router.push(`create_list`) }
  function addRoute() { router.push(`add_list`) }

  return (
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <button class="save" onClick={createRoute}>Create New List</button> 
              <button class="save" onClick={addRoute}>Add List By Address</button> 
              <div class="card-list">
                { lists.length == 0 ? <h4>It seems you don't have any lists, you should make one!</h4> : null }
                { lists.map(item => (<List address={item} />)) }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
