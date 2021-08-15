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
        }

        this.colors = ['red', 'blue', 'green', 'yellow'],
        this.messageCount = 0,

        this.io = null

        // Port Definition
        this.ports = {
            // message: {
            //   default: {message:'connected'},
            //   input: {type: undefined},
            //   output: {type: 'object'},
            //   onUpdate: (userData) => {
            //     return userData
            //   }
            // },
            // onmessage: {
            //   input: {type: 'object'},
            //   output: {type: null},
            //   onUpdate: (userData) => {
            //     userData.forEach(u => {
            //       if (u.data.message === 'connected'){

            //         console.log(this.session.info)
            //         if (u.id == this.session.info.auth.id) this.messageContainer.innerHTML = ''

            //         this._appendMessage(`${u.username} connected`)
            //       } else {
            //         this._appendMessage(`${u.username}: ${u.data.message}`, u.data.color)
            //       }
          
            //     })
            //   }
            // }
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
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
   
          <div id="main-div">
            <div id="message-container"></div>
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
          
          <form id="send-container">
            <input type="text" id="message-input">
            <button type="submit" id="send-button">Send</button>
            <button style='position: relative;' type="button", id="devicebutton" class="brainsatplay-default-button">Connect BCI</button>
          </form>
       
        
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
              this.loader = document.getElementsByClassName('lds-roller')[0]
              console.log(this.loader)
              
              const name = prompt('What is your name?') // not necessary 
              this._appendMessage('You joined')
              socket.emit('new-user', name)

              socket.on('chat-message', data => {
              this._appendMessage(`${data.name}: ${data.message}`, data.color)
              })

              socket.on('user-connected', name => {
              // console.log(name)
              this._appendMessage(`${name} connected`)
              })

              socket.on('user-disconnected', name => {
              this._appendMessage(`${name} disconnected`)
              })

              messageInput.addEventListener('input', (e) => {
                if (e.target.value !== '') {
                  if (e.target.value.length == 1) { // potential error
                    if (Date.now() - this.props.timestamps.startEEG > 5*1000) {
                      console.log('start message');
                      this.props.timestamps.start = Date.now() - 5*1000
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
              this._onMessageSend(message).then((m_color) => {
                  console.log('COLOR',m_color)
                  // this.session.graph.runSafe(this, 'message', [{data: {message, color: m_color}}])
                  socket.emit('send-chat-message', {message: message, color: m_color})
                  messageInput.value = ''
              }).catch((error) => {
                  this._hideLoader()
                  // this.session.graph.runSafe(this, 'message', [{data: {message, color: "grey"}}])
                  socket.emit('send-chat-message', {message: message} ) // this._appendMessage(`You: ${message}`)
                  alert("Error detecting your emotion: "+error)
                  this._appendMessage(`You: ${message}`)
                  messageInput.value = ''
                  return
        
                 })
         
              })
            
            }, 1000)

        }


        return {HTMLtemplate, setupHTML}
    }

    deinit = () => {}

    _userAdded = (userData) => {
      let u = userData[0]
      console.log(u)
      // this.props.readouts.innerHTML += `<p id="${this.props.id}-${u.id}" class="readout" >${u.username}: ${u.data ?? ''}</p>`
      // _appendMessage because userconnected has already been broadcasted, no need to runsafe

  }

  _userRemoved = (userData) => {
      let u = userData[0]
      console.log(u)
      // let readout = document.getElementById(`${this.props.id}-${u.id}`)
      // readout.remove()
      // _appendMessage
  }

    _showLoader = () => {
      this.loader.style.visibility = "visible";

    }

    _hideLoader = () => {
      this.loader.style.visibility = "hidden";

    }

    _appendMessage = (message, color="black") => { // add conditional that checks user id 
      ++this.messageCount;
      const messageElement = document.createElement('div')
      messageElement.innerText = message
      messageElement.style.color = color
      // if (this.messageCount % 4 == 0) {
      //   messageElement.style.color = this.fakecolors[0]
      // }else if (this.messageCount % 4 == 1){
      //   messageElement.style.color = this.fakecolors[1]
      // }else if (this.messageCount % 4 == 2){
      //   messageElement.style.color = this.fakecolors[2]
      // }else if (this.messageCount % 4 == 3){
      //   messageElement.style.color = this.fakecolors[3]
      // }
      this.messageContainer.append(messageElement)
    }

    _onMessageSend = (message) => {

      return new Promise(async (resolve, reject) => {
         // Detect when Video Stops
         this.props.timestamps.stop = Date.now()
         this._showLoader()

         // Grab Data from B@P
         let data = this.session.atlas.data.eeg // parse EEG using timestamps in JS
         console.log(data)
        
         try {
            this.fs = this.session.deviceStreams[0].info.sps
         } catch (error) {
            this._hideLoader()
            reject('Please Connect a Device')
         }

         let time_delay = Math.abs(Math.round((this.props.timestamps.start -  this.props.timestamps.startEEG)/1000))
        
         let finalData = []
         let fs = this.fs


         // Pick Headset and Splice Number of Channels
         if (this.session.deviceStreams[0].info.deviceName == "muse") {
           for (const x in data.slice(0, 4)) { 
              finalData.push(data[x]["raw"].slice(time_delay*Math.round(this.fs), data[x]["raw"].length+1)) 
            
            }

          } else {
            for (const x in data.slice(0, 8)) {
              finalData.push(data[x]["raw"].slice(time_delay*Math.round(this.fs), data[x]["raw"].length+1))
            }
          }

         console.log(finalData[0].length)

         if (finalData[0].length < fs*5) {
          this._hideLoader()
          reject("We are still collecting data, no emotion detected")
         }

        // data.forEach((item, index, array) => {
        //   console.log(array)
        // })
 
         let url = 'http://127.0.0.1:5000/emotions'
         let body = {
             finalData,
             fs
         }
 
         // Send to server
        //  fetch(url, {method: 'POST', body: JSON.stringify(body), headers: {"Access-Control-Allow-Origin": "http://127.0.0.1:5000/", "Content-Type": "application/json"} })
        // .then(response => response.json())
        // .then(emotion => {
 
        //      // Get Video Back
        //      console.log(emotion)
        //      this._hideLoader()
        //      this._appendMessage(`You: ${message}`, this.colors[emotion])
        //      return await this.colors[emotion]
             
        //      // Display Video
             
        //  }).catch((error) => {
        //   this._hideLoader()
        //   this._appendMessage(`You: ${message}`)
        //   alert("Error detecting your emotion: "+error)
        //   return

        //  });
        let response = await fetch(url, {method: 'POST', body: JSON.stringify(body), headers: {"Access-Control-Allow-Origin": "http://127.0.0.1:5000/", "Content-Type": "application/json"} })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let pred = await response.json()
        console.log(pred)
        this._hideLoader()
        this._appendMessage(`You: ${message}`, this.colors[pred])
        resolve(this.colors[pred])
      })
    }

    _deviceConnected = () => {
        // let museButton = document.getElementById(`${this.props.id}`).querySelector(`[id="musebutton"]`)
        // museButton.style.display = 'none'
        this.props.timestamps.startEEG =  Date.now()
    }
}
export {UI}