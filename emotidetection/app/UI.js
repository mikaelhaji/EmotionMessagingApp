

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


          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>P300-based BCI Stimulus Presentation Paradigm</title>
 
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
          <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">


        </head>
        <body>
          <div style = "z-index: 2, position: relative", class: "pages" > 
          <form class="send-container">
              <input type="text" class="message-input">
              <button type="submit" class="send-button">Send</button>
              <button style='position: relative;' type="button", class="brainsatplay-default-button devicebutton">Connect BCI</button>
            </form>
          </div>

          <div style = "z-index: 1, opacity: 0, position: relative", class: "pages" >


            <div id="main-div">
              <div id="message-container"></div>
              <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            
            
            <form id="send-container">
              <input type="text" id="message-input">
              <button type="submit" id="send-button">Send</button>
              <button style='position: relative;' type="button", id="devicebutton" class="brainsatplay-default-button">Connect BCI</button>
            </form>


            

            <div id="speller_matrix">
    
            <table>
              <tr>
                <td id="A">A</td>
                <td id="B">B</td> 
                <td id="C">C</td>
                <td id="D">D</td>
                <td id="E">E</td> 
                <td id="F">F</td>
              </tr>
            
              <tr>
                <td id="G">G</td>
                <td id="H">H</td> 
                <td id="I">I</td>
                <td id="J">J</td>
                <td id="K">K</td> 
                <td id="L">L</td>
              </tr>
            
              <tr>
                <td id="M">M</td>
                <td id="N">N</td> 
                <td id="O">O</td>
                <td id="P">P</td>
                <td id="Q">Q</td> 
                <td id="R">R</td>
              </tr>
              
              <tr>
                <td id="S">S</td>
                <td id="T">T</td> 
                <td id="U">U</td>
                <td id="V">V</td>
                <td id="W">W</td> 
                <td id="X">X</td>
              </tr>
              
              <tr>
                <td id="Y">Y</td>
                <td id="Z">Z</td> 
                <td id="0">0</td>
                <td id="1">1</td>
                <td id="2">2</td> 
                <td id="3">3</td>
              </tr>
              
              <tr>
                <td id="4">4</td>
                <td id="5">5</td> 
                <td id="6">6</td>
                <td id="7">7</td>
                <td id="8">8</td> 
                <td id="9">9</td>
              </tr>
            
            </table>
            
            </div>
            
            <div>
            
              <button class="btn-primary btn-lg" id="start">START</button>
            
            </div>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
            
            <script src="functions.js"></script>
              
          </div>
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




// $(document).ready(function() {		
// 	$("#start").click( 
// 		function() {
			
// 			number_of_trials = 5;
			
// 			var all_chars = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
// 			new_chars = shuffle(all_chars);
// 			number_of_trials--;
			
// 			for(a=0; a<number_of_trials; a++) {
// 				temp_chars = shuffle(all_chars);
// 				new_chars = new_chars.concat(temp_chars);
// 			}
						
// 			c=new_chars.length;
// 			i=0;
			
// 			var d = new Date();
// 			var m = d.getMinutes();
// 			var s = d.getSeconds();
// 			var n = d.getMilliseconds();
// 			console.log(m*60*1000+1000*s+n); // output second+ms to console log
// 			setTimeout(flash,2000);
// 			// 2 second pause before stimulus presentation starts
			
// 			var flash_time = 100;
// 			var ISI = 100;
			
// 			function flash() {
				
// 				var d = new Date();
// 				var m = d.getMinutes();
// 				var s = d.getSeconds();
// 				var n = d.getMilliseconds();
// 				console.log(m*60*1000+1000*s+n); // output second+ms to console log
											
// 				if(i<c) {
					
// 					var flash_index = new_chars[i];
					
// 					light_unlit(flash_index,1); // highlight element
					
// 					setTimeout(
// 						function() {
// 							light_unlit(flash_index,0); // revert element to default colour after flash
							
// 							var d = new Date();
// 							var m = d.getMinutes();
// 							var s = d.getSeconds();
// 							var n = d.getMilliseconds();
// 							console.log(m*60000+1000*s+n); // output second+ms to console log
							
// 							setTimeout(flash,ISI);
// 						}
// 					,flash_time);
					
// 				}
			
// 				i++;
			
// 			}
// 			// recursive function to keep calling setTimeout until all characters have flashed
						
// 			function light_unlit(char_index,state) {
				
// 				if(state==0) {
// 					stim_colour = "white";
// 				} else {
// 					stim_colour = "red";
// 				}
				
// 				switch(char_index) {
// 				case 1: $("#A").css("color",stim_colour); break;
// 				case 2: $("#B").css("color",stim_colour); break;
// 				case 3: $("#C").css("color",stim_colour); break;
// 				case 4: $("#D").css("color",stim_colour); break;
// 				case 5: $("#E").css("color",stim_colour); break;
// 				case 6: $("#F").css("color",stim_colour); break;
// 				case 7: $("#G").css("color",stim_colour); break;
// 				case 8: $("#H").css("color",stim_colour); break;
// 				case 9: $("#I").css("color",stim_colour); break;
// 				case 10: $("#J").css("color",stim_colour); break;
// 				case 11: $("#K").css("color",stim_colour); break;
// 				case 12: $("#L").css("color",stim_colour); break;
// 				case 13: $("#M").css("color",stim_colour); break;
// 				case 14: $("#N").css("color",stim_colour); break;
// 				case 15: $("#O").css("color",stim_colour); break;
// 				case 16: $("#P").css("color",stim_colour); break;
// 				case 17: $("#Q").css("color",stim_colour); break;
// 				case 18: $("#R").css("color",stim_colour); break;
// 				case 19: $("#S").css("color",stim_colour); break;
// 				case 20: $("#T").css("color",stim_colour); break;
// 				case 21: $("#U").css("color",stim_colour); break;
// 				case 22: $("#V").css("color",stim_colour); break;
// 				case 23: $("#W").css("color",stim_colour); break;
// 				case 24: $("#X").css("color",stim_colour); break;
// 				case 25: $("#Y").css("color",stim_colour); break;
// 				case 26: $("#Z").css("color",stim_colour); break;
// 				case 27: $("#0").css("color",stim_colour); break;
// 				case 28: $("#1").css("color",stim_colour); break;
// 				case 29: $("#2").css("color",stim_colour); break;
// 				case 30: $("#3").css("color",stim_colour); break;
// 				case 31: $("#4").css("color",stim_colour); break;
// 				case 32: $("#5").css("color",stim_colour); break;
// 				case 33: $("#6").css("color",stim_colour); break;
// 				case 34: $("#7").css("color",stim_colour); break;
// 				case 35: $("#8").css("color",stim_colour); break;
// 				case 36: $("#9").css("color",stim_colour); break;
// 				default: 
// 				}
			
// 			}
			
// 			function shuffle(array) {
// 				var currentIndex = array.length, temporaryValue, randomIndex;

// 				// While there remain elements to shuffle...
// 				while (0 !== currentIndex) {

// 					// Pick a remaining element...
// 					randomIndex = Math.floor(Math.random() * currentIndex);
// 					currentIndex -= 1;

// 					// And swap it with the current element.
// 					temporaryValue = array[currentIndex];
// 					array[currentIndex] = array[randomIndex];
// 					array[randomIndex] = temporaryValue;
// 				}

// 				return array;
// 			}
					
// 		}
				
// 	);
	
// });