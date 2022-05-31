import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from '../../artifacts/contracts/TodoList.sol/TodoList.json'
import { useRouter } from 'next/router'

export default function List(props) {
  
  const [listTitle, setTitle] = useState()
  const [listData, setListData] = useState([])
  const router = useRouter()

  const getData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(props.address, TodoList.abi, provider)
    const title = await contract.getTitle()
    const data = await contract.getData()
    const tasks = []

    for (let i = 0; i < data[0].length; i++) {
      tasks.push({
        id: i,
        contents: data[0][i],
        completed: data[1][i]
      })
    }

    if (tasks.length > 3) {
      tasks = tasks.splice(1)
      tasks.push({
        id: 100, 
        contents: '...',
        completed: false
      })
    }

    tasks = tasks.filter(each => !each.completed)
    
    setTitle(title)
    setListData(tasks)
  }

  async function route() {
    const slug = listTitle.replace(/\s/g, '-')
    router.push({ 
      pathname: `lists/${slug}`, 
      query: { address: props.address }
    }, `lists/${slug}`)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div class="card-item">
      <a class="nav-link" onClick={route}>{listTitle}</a>
      {
        listData.map(item => (
          <p>{item.contents}</p>
        ))
      }
    </div>
  )
}