import Head from 'next/head'
import { useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress } from '../config'
import Main from '../artifacts/contracts/Main.sol/Main.json'
import TodoList from '../artifacts/contracts/TodoList.sol/TodoList.json'
import { useRouter } from 'next/router'

export default function CreateList() {
  const router = useRouter()
  const [formData, fillForm] = useState()

  async function contractAdd(e) {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Main.abi, signer)
      await contract.addList(formData.address, {from: window.sessionStorage.getItem('userAddress')})
      
      contract.once('Add', async (contractAddr, event) => {
        const title = await new ethers.Contract(contractAddr, TodoList.abi, provider).getTitle()
        const slug = title.replace(/\s/g, '-')
        router.push({ 
          pathname: `lists/${slug}`, 
          query: { address: contractAddr }
        }, `lists/${slug}`)
      })
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

  function handleKeyPress(e) {
    if (e.keyCode != 13) return
    contractAdd(e)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form>
                <input className="form-control add-task" onKeyDown={handleKeyPress} type="text" placeholder="Address" onChange={e => fillForm({...formData, address: e.target.value})} required/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
