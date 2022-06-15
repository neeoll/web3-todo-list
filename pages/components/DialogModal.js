import Metamask from '../../public/metamask.svg'
import WalletConnect from '../../public/walletconnect.svg'
import Coinbase from '../../public/coinbase.svg'
import { styled } from "@stitches/react"

export default function DialogModal({ select })  {
  return (
    <>
      <StyledHeader>Choose a Provider</StyledHeader>
      <StyledGrid>
        <StyledGridItem position={'one'} onClick={() => { select('injected') }}>
            <StyledGridContents><Metamask /></StyledGridContents>
        </StyledGridItem>
        <StyledGridItem position={'two'} onClick={() => { select('walletconnect') }}>
          <StyledGridContents><WalletConnect /></StyledGridContents>
        </StyledGridItem>
        <StyledGridItem position={'three'} onClick={() => { select('coinbasewallet') }}>
          <StyledGridContents><Coinbase /></StyledGridContents>
        </StyledGridItem>
      </StyledGrid>
    </>
  )
}

const StyledHeader = styled('h2', {
  display: 'inline-block',
  width: '100%',
  textAlign: 'center',
  justifySelf: 'center'
})

const StyledGrid = styled('div', {
  display: 'grid',
  marginBottom: 10,
})

const StyledGridItem = styled('div', {
  width: 200,
  height: 175,
  borderRadius: 5,
  margin: 10,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#191919',
  variants: {
    position: {
      'one': { gridRow: 1, gridColumn: 1, marginRight: 5, marginBottom: 5 }, 'two': { gridRow: 1, gridColumn: 2, marginLeft: 5, marginBottom: 5 },
      'three': { gridRow: 2, gridColumn: 1, marginRight: 5, marginTop: 5 }, 'four': { gridRow: 2, gridColumn: 2, marginLeft: 5, marginTop: 5 }
    }
  },
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: '#222'
  }
})

const StyledGridContents = styled('div', {
  paddingTop: 23.5,
  display: 'flex',
  justifyContent: 'center'
})