import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState()
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')

  const connectWalletHandler = async() => {
    if (typeof window.ethereum == 'undefined') {
      setErrorMessage('Please install the MetaMask browser extension to interact')
      return
    }

    window.ethereum.request({ method: 'eth_requestAccounts'})
    .then(result => {
      window.sessionStorage.setItem('userAddress', result[0])
      router.push({ 
        pathname: '/lists', 
        query: { address: result[0] }
      }, '/lists')
      setConnButtonText('Wallet Connected')
    })
    .catch(error => {
      setErrorMessage(error.message)
    })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <main>
                <button className="save" onClick={connectWalletHandler}>{connButtonText}</button>
                {errorMessage}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}