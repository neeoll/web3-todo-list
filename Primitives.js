import { styled } from '@stitches/react'

 export const StyledCard = styled('div', {
    padding: 25,
    margin: 20,
    border: 'none',
    color: '#fff',
    backgroundColor: '#292929',
    variants: {
      page: {
        'connect': {
          justifyContent: 'center',
          display: 'grid',
        }
      },
      writeAccess: {
        false: {
          pointerEvents: 'none'
        }
      }
    }
  })

 export const StyledActions = styled('div', {
    backgroundColor: '#191919',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  })

 export const StyledCardList = styled('div', {
    listStyle: 'none',
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#191919',
    borderRadius: 5,
    outline: 'none',
  })

 export const StyledCardItem = styled('div', {
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 0,
    backgroundColor: '#292929',
    color: '#fff',
    borderRadius: 5,
    overflowY: 'auto'
  })

 export const StyledForm = styled('form', {
    backgroundColor: '#191919',
    display: 'flex',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  })

 export const StyledButton = styled('button', {
    padding: 7.5,
    marginRight: 10,
    color: '#fff',
    border: 'none',
    fontSize: 16,
    borderRadius: 5,
    variants: {
      type: {
        'save': {
          backgroundColor: '#0075FF',
          '&:hover': { backgroundColor: '#0062d2' }
        },
        'cancel': {
          backgroundColor: '#F71919',
          '&:hover': { backgroundColor: '#c81414' }
        }
      },
      ignoreBlock: {
        true: {
          pointerEvents: 'all'
        }
      }
    }
  })