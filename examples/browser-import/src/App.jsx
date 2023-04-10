import { useState } from 'react'
import './App.css'
import ExtractColors from "extract-colors"
import Colors from "./Colors"

const src = `https://loremflickr.com/640/480?lock=${ Math.floor(Math.random() * 0xFFFFFF) }`

function App() {
  const [colors, setColors] = useState([]);

  const onLoad = async (event) => {
    const list = await ExtractColors(event.target, { crossOrigin: 'anonymous' })
    setColors(list)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Extract colors with random image
        </p>
        <img src={ src } width="640" height="480" alt="Random" onLoad={onLoad} />
        <Colors colors={colors} />
      </header>
    </div>
  )
}

export default App
