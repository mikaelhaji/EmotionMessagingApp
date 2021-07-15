// import { io } from "http://localhost:3000/socket.io/socket.io.js";
class UI{

    static id = String(Math.floor(Math.random()*1000000))

    constructor(label, session) {

        // Generic Plugin Attributes
        this.label = label
        this.session = session
        this.params = {}

        // UI Identifier
        this.props = {
            id: String(Math.floor(Math.random()*1000000)),
            timestamps: {
                startEEG: Date.now(),
                start: null,
                stop: null
            },
            video: null
        }

        this.io = null,

        // Port Definition
        this.ports = {
            default: {},
        }
    }

    init = () => {

        this.props.script = document.createElement("script");
        this.props.script.src = "https://cdn.socket.io/4.1.2/socket.io.min.js" 
        this.props.script.async = true;

        console.log('loading io')
        this.props.script.onload = () => {
            this.io = io('http://localhost:3000')
        }
        document.body.appendChild(this.props.script);

        // Simply define the HTML template
        let HTMLtemplate = () => {return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Chat App</title>
          // <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <button id="devicebutton" class="brainsatplay-default-button">Connect BCI</button>
          <div id="message-container"></div>
          <form id="send-container">
            <input type="text" id="message-input">
            <button type="submit" id="send-button">Send</button>
          </form>
          
          <button style='position: relative; top: -18px;' id="devicebutton" class="brainsatplay-default-button">Connect BCI</button>
        
        
          </body>

        </html>`
        }


        let setupHTML = () => {

            setTimeout(() => {

              const socket = this.io

              // console.log(socket)
              this.messageContainer = document.getElementById('message-container')
              const messageForm = document.getElementById('send-container')
              const messageInput = document.getElementById('message-input')
              
              const name = prompt('What is your name?')
              this._appendMessage('You joined')
              socket.emit('new-user', name)

              socket.on('chat-message', data => {
              this._appendMessage(`${data.name}: ${data.message}`)
              })

              socket.on('user-connected', name => {
              console.log(name)
              this._appendMessage(`${name} connected`)
              })

              socket.on('user-disconnected', name => {
              this._appendMessage(`${name} disconnected`)
              })

              messageInput.addEventListener('input', (e) => {
                if (e.target.value !== '') {
                  if (e.target.value.length == 1) { // potential error
                    if (Date.now() - this.props.timestamps.startEEG > 10*1000) {
                      console.log('start message');
                      this.props.timestamps.start = Date.now() - 10*1000
                    }
                    else {
                      console.log('start message');
                      this.props.timestamps.start = Date.now()
                    }
                  }
                }
                else {
                  console.log('nothing in box');
                  this.props.timestamps.start = null
                }
              })
              

              messageForm.addEventListener('submit', e => {
              e.preventDefault()
              const message = messageInput.value
              this._appendMessage(`You: ${message}`)
              socket.emit('send-chat-message', message)
              this._onMessageSend()
              messageInput.value = ''
              })
            
            }, 1000)

        }


        return {HTMLtemplate, setupHTML}
    }

    default = (input) => {
        return input
    }

    deinit = () => {}

    _appendMessage = (message) => {
      const messageElement = document.createElement('div')
      messageElement.innerText = message
      this.messageContainer.append(messageElement)
      }

    _onMessageSend = () => {
         // Detect when Video Stops
         this.props.timestamps.stop = Date.now()


         // Grab Data from B@P
         let data = this.session.atlas.data.eeg // parse EEG using timestamps in JS
         console.log(data)

         let fs = this.session.deviceStreams[0].info.sps

         let time_delay = Math.round((this.props.timestamps.start -  this.props.timestamps.startEEG)/1000)
         console.log(time_delay)
        
         let finalData = []
         


         // Pick Headset and Splice Number of Channels
         if (this.session.deviceStreams[0].info.deviceName == "muse") {
           for (const x in data.slice(0, 4)) { 
              finalData.push(data[x]["raw"].slice(time_delay*Math.round(fs), data[x]["raw"].length+1)) 
            
            }

          } else {
            for (const x in data.slice(0, 8)) {
              finalData.push(data[x]["raw"].slice(time_delay*Math.round(fs), data[x]["raw"].length+1))
            }
          }

         console.log(finalData.length)

        // data.forEach((item, index, array) => {
        //   console.log(array)
        // })
 
         let url = 'http://127.0.0.1:5000/emotions'
         let body = {
             finalData, 
             fs
         }
 
         // Send to server
         fetch(url, {method: 'POST', body: JSON.stringify(body), headers: {"Access-Control-Allow-Origin": "http://127.0.0.1:5000/", "Content-Type": "application/json"} })
        .then(res => {
 
             // Get Video Back
             console.log(res)
             
             // Display Video
             
         })
    }

    _deviceConnected = () => {
        // let museButton = document.getElementById(`${this.props.id}`).querySelector(`[id="musebutton"]`)
        // museButton.style.display = 'none'
        this.props.timestamps.startEEG =  Date.now()
    }
}
export {UI}