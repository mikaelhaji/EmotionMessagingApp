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
        intro:{
                title: false,
                mode: 'multi'
        },
        graph: {
                "nodes":[
                        {id: 'ui', class: UI, params: {}},
                        {id:'brainstorm', class: brainsatplay.plugins.networking.Brainstorm}
                ],
                "edges": [
                {
                        source: 'ui:message',
                        target: 'brainstorm'
                },
                {
                       source: 'brainstorm:ui_message',
                //        source: 'brainstorm:message',


                       target: 'ui:onmessage'

                },
                // {
                //         source: 'ui:message',
                //         target: 'ui:onmessage'
                // }
        ]
        },
        // editor: {
        //         "parentId":"brainsatplay-studio",
        //         "show":true,
        //         "style":"\n position: block;\n z-index: 9;\n "
        // },
        connect: {
        toggle: 'devicebutton',
        filter: [
                "Muse 2"
                , "Cyton"
                ],
        onconnect: () => {

                settings.graph.nodes.find(n => {
                        if (n.id === 'ui'){
                                n.instance._deviceConnected()
                        }       
                })

            }
        }
}; 
        