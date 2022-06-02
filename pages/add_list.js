import { useState } from 'react'
import { ethers } from 'ethers'
import TodoList from '../artifacts/contracts/TodoList.sol/TodoList.json'
import { useRouter } from 'next/router'

export default function AddList() {
  const router = useRouter()
  const [formData, fillForm] = useState()

  async function routeToList(e) {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(formData.address, TodoList.abi, provider)
    const title = await contract.getTitle()
    const slug = title.replace(/\s/g, '-')
    router.push({ 
      pathname: `lists/${slug}`, 
      query: { address: formData.address }
    }, `lists/${slug}`)
  }

  function handleKeyPress(e) {
    if (e.keyCode != 13) return
    routeToList(e)
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
