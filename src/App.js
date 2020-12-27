import React, {useState, useEffect, useRef} from 'react'
import './App.css';
import Speech from 'react-speech';

const topicTypes = [
  "animals",
  "places"
]

const defaultData = {
  topics: topicTypes.reduce((ac,a) => ({...ac,[a]:''}),{}),
  topicsLoading: topicTypes.length
}

function App() {
  const [data, setData] = useState(defaultData)
  const [inputText, setInputText] = useState("")
  const speechComponent = useRef(null);
  
  useEffect(() => {
    topicTypes.forEach((type) => {
      fetch(`https://raw.githubusercontent.com/maxwellbenton/alexa-talker-site/master/data/${type}.json`)
      .then(res => res.json())
      .then(retrievedData => {
        setData(oldData => ({
          ...oldData,
          topics: {
            ...oldData.topics,
            [`${type}`]: retrievedData
          },
          topicsLoading: oldData.topicsLoading - 1
        }))
      })
    })

    setInputText("Generating Alexa command...")
  }, [])

  useEffect(() => {
    console.log(data)
    if (data.topicsLoading <= 0) {
      
      let generalTopics = Object.keys(data.topics)
      let generalTopic = generalTopics[Math.floor(Math.random() * generalTopics.length)]
      let topic = data.topics[generalTopic][Math.floor(Math.random() * data.topics[generalTopic].length)]
      let randomCommand = `Alexa, tell me about ${topic}`
      setInputText(randomCommand)
    }
  }, [data])

  function handleChange(input) {
    setInputText(input.target.value)
  }

  return (
    <div>
      <input value={inputText} onChange={handleChange}/>
      <Speech 
        ref={speechComponent} 
        text={inputText} 
        voice="Google UK English Male"
      />
    </div>
  );
}

export default App;
