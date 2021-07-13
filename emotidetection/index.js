import {settings} from './app/settings.mjs'
import * as brainsatplay from 'brainsatplay'
let app =  new brainsatplay.Application(settings)
app.init()