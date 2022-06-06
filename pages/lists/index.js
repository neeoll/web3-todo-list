import { useRouter } from 'next/router'
import List from '../components/List'
import { useState, useEffect } from 'react'
import Main from '../../artifacts/contracts/Main.sol/Main.json'
import { ethers } from 'ethers'
import { contractAddress } from '../../config'
import Link from 'next/link'

export default function Lists() {

  const [lists, updateLists] = useState([])
  const router = useRouter()

  const getLists = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, Main.abi, provider)
    const contractData = await contract.getLists({from: window.sessionStorage.getItem('userAddress')})

    for (let i = 0; i < contractData.length; i++) {
      updateLists([...lists, {id: i, address: contractData[i]}])
    }
  }

  useEffect(() => {
    getLists()
  }, [])

  const listRoute = (listName, listAddr) => {
    const slug = listName.replace(/\s/g, '-')
    router.push({ 
      pathname: `lists/${slug}`, 
      query: { address: listAddr }
    }, `lists/${slug}`)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <Link href={'create_list'}><button className="save">Create New List</button></Link>
              <Link href={'add_list'}><button className="save">Add List By Address</button></Link>
              <div className="card-list">
                { lists.length == 0 ? <h4>You don't have any lists, time to make one!</h4> : null }
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
