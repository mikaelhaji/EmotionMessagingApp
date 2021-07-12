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
                startEEG: null,
                start: null,
                stop: null
            },
            message: null
        }

        // Port Definition
        this.ports = {
            default: {},
        }
    }

    init = () => {
        // Simply define the HTML template
        let HTMLtemplate = () => {return `
            <div id='${this.props.id}' style='height:100%; width:100%; display: flex; align-items: center; justify-content: center;'>
                <div>
                    <button id="devicebutton" class="brainsatplay-default-button">Open Device Manager</button>
                    <input type='file' id="${this.props.id}load"></input>
                </div>
            </div>`
        }


        let setupHTML = () => {
            let load = document.getElementById(`${this.props.id}load`)
            load.onchange = (res) => {
                this._handleVideoLoad(load.files[0]) //CHANGE THIS STUFF ASAP
            }
        }


        return {HTMLtemplate, setupHTML}
    }

    default = (input) => {
        return input
    }

    deinit = () => {}

    _initMessage = (message) => {
        this.props.timestamps.start = Date.now() - 10*1000
        this.props.message = message
        console.log(message)

    }

    _onMessageSend = () => {
         // Detect when Video Stops
         this.props.timestamps.stop = Date.now()


         // Grab Data from B@P
         let data = this.session.atlas.data.eeg
         console.log(data)
 
         let url = ''
         let body = {
             data, 
             timestamps: this.props.timestamps,
             message: this.props.message
         }
 
         // Send to server
         fetch(url, {method: 'POST', body}).then(res => {
 
             // Get Video Back
             console.log(res)
             
             // Display Video
             
         })
    }

    _deviceConnected = () => {
        let museButton = document.getElementById(`${this.props.id}`).querySelector(`[id="devicebutton"]`)
        museButton.style.display = 'none'
        this._onVideoStop()
        this.props.timestamps.startEEG =  Date.now()
    }
}
export {UI}