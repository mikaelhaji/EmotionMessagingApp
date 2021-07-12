

import {UI} from './UI.js'

export const settings = {
        name: "Emotion Detection Messaging App",
        devices: ["EEG"],
        author: "Mikky and Anmu",
        description: "Classifying interest in a messaging app",
        categories: ["WIP"],
        instructions: "",
        display: {
                "production":false
        },
        graph: {
                "nodes":[
                        {id: 'ui', class: UI, params: {}}
                ],
                "edges":[]
        },
        // editor: {
        //         "parentId":"brainsatplay-studio",
        //         "show":true,
        //         "style":"\n position: block;\n z-index: 9;\n "
        // },
        connect: {
        toggle: 'devicebutton',
        onconnect: () => {
                settings.graph.nodes.find(n => {
                if (n.id === 'ui'){
                        n.instance._deviceConnected()
                }       
        })}
        }
};