import { createGlobalStyle } from 'styled-components'


const GlobalStyle = createGlobalStyle`
  * {
    font-family: sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }

  a {
    text-decoration: none;
  }

  /* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: ${({ theme }) => theme.colors.secondary}; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: ${({ theme }) => theme.colors.secondary};
}

body.modal-open #manu-box{
  -webkit-filter: blur(4px);
  -moz-filter: blur(4px);
  -o-filter: blur(4px);
  -ms-filter: blur(4px);
  filter: blur(4px);
}
`

export default GlobalStyle
