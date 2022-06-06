import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from '../../artifacts/contracts/TodoList.sol/TodoList.json'

export default function List(props) {
  
  const [listTitle, setTitle] = useState()
  const [listData, setListData] = useState([])

  useEffect(() => {
    const getData = async() => {
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
  
      tasks = tasks.filter(each => !each.completed)
  
      if (tasks.length > 2) {
        tasks = tasks.splice(1)
        tasks.push({
          id: 100, 
          contents: '...',
          completed: false
        })
      }
      
      setTitle(title)
      setListData(tasks)
    }
    getData()
  }, [props])

  const route = () => {
    props.route(listTitle, props.address)
  }

  return (
    <div className="card-item">
      <a className="nav-link" onClick={route}>{listTitle}</a>
      {
        listData.map(item => (
          <li key={item.id}>
            <p>{item.contents}</p>
          </li>
        ))
      }
    </div>
  )
}