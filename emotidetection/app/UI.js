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
                start: null,
                stop: null
            },
            video: null
        }

        this.io = io('http://localhost:3000'),

        // Port Definition
        this.ports = {
            default: {},
        }
    }

    init = () => {
        // Simply define the HTML template
        let HTMLtemplate = () => {return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Chat App</title>
          <script defer src="http://localhost:3000/socket.io/socket.io.js"></script>
          <script defer scr="


          // Create a new script and do exactly ehat we were doing before in which you would have yout socket (wherever it is) you call functions call them inside there
          <style>
            body {
              padding: 0;
              margin: 0;
              display: flex;
              justify-content: center;
            }
        
            #message-container {
              width: 80%;
              max-width: 1200px;
            }
        
            #message-container div {
              background-color: #CCC;
              padding: 5px;
            }
        
            #message-container div:nth-child(2n) {
              background-color: #FFF;
            }
        
            #send-container {
              position: fixed;
              padding-bottom: 30px;
              bottom: 0;
              background-color: white;
              max-width: 1200px;
              width: 80%;
              display: flex;
            }
        
            #message-input {
              flex-grow: 1;
            }
          </style>
        </head>
        <body>
          <div id="message-container"></div>
          <form id="send-container">
            <input type="text" id="message-input">
            <button type="submit" id="send-button">Send</button>
          </form>
        </body>
        </html>`
        }


        let setupHTML = () => {
            const socket = this.io
            const messageContainer = document.getElementById('message-container')
            const messageForm = document.getElementById('send-container')
            const messageInput = document.getElementById('message-input')

            const name = prompt('What is your name?')
            appendMessage('You joined')
            // socket.emit('new-user', name)

            // socket.on('chat-message', data => {
            // appendMessage(`${data.name}: ${data.message}`)
            // })

            // socket.on('user-connected', name => {
            // console.log(name)
            // appendMessage(`${name} connected`)
            // })

            // socket.on('user-disconnected', name => {
            // appendMessage(`${name} disconnected`)
            // })

            // messageForm.addEventListener('submit', e => {
            // e.preventDefault()
            // const message = messageInput.value
            // appendMessage(`You: ${message}`)
            // socket.emit('send-chat-message', message)
            // messageInput.value = ''
            // })

            function appendMessage(message) {
            const messageElement = document.createElement('div')
            messageElement.innerText = message
            messageContainer.append(messageElement)
            }
        }


        return {HTMLtemplate, setupHTML}
    }

    default = (input) => {
        return input
    }

    deinit = () => {}

    _handleVideoLoad = (file) => {
        this.props.timestamps.start = Date.now()
        this.props.video = file
        console.log(video)

    }

    _onVideoStop = () => {
         // Detect when Video Stops
         this.props.timestamps.stop = Date.now()


         // Grab Data from B@P
         let data = this.session.atlas.data.eeg
         console.log(data)
 
         let url = ''
         let body = {
             data, 
             timestamps: this.props.timestamps,
             video: this.props.video
         }
 
         // Send to server
         fetch(url, {method: 'POST', body}).then(res => {
 
             // Get Video Back
             console.log(res)
             
             // Display Video
             
         })
    }

    _deviceConnected = () => {
        let museButton = document.getElementById(`${this.props.id}`).querySelector(`[id="musebutton"]`)
        museButton.style.display = 'none'
        this._onVideoStop()
    }
}
export {UI}