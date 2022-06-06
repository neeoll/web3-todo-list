import { useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress } from '../config'
import Main from '../artifacts/contracts/Main.sol/Main.json'
import { useRouter } from 'next/router'

export default function CreateList() {
  const router = useRouter()
  const [formData, fillForm] = useState()

  const contractCreate = async(e) => {
    e.preventDefault()
    if (typeof window.ethereum == 'undefined') return
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = new ethers.Contract(contractAddress, Main.abi, signer)
    await contract.createList(formData.name, {from: window.sessionStorage.getItem('userAddress')})
    
    contract.once('Create', async (contractAddr, event) => {
      const slug = formData.name.replace(/\s/g, '-')
      router.push({ 
        pathname: `lists/${slug}`, 
        query: { address: contractAddr }
      }, `lists/${slug}`)
    })
  }

  const handleKeyPress = (e) => {
    if (e.keyCode != 13) return
    contractCreate(e)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form>
                <input className="form-control add-task" onKeyDown={handleKeyPress} type="text" placeholder="Name" onChange={e => fillForm({...formData, name: e.target.value})} required/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
