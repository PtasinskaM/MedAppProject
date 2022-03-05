import Vue from 'vue';
import Vuetify from 'vuetify/lib';

//import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

import pl from 'vuetify/es5/locale/pl'
//import pl from 'vuetify/src/locale/pl'
//definicja motywu
export default new Vuetify({
    
    lang: {
        locales: { pl },
        current: 'pl',
    },
    theme:{
        dark: false,
        themes: {
            light: {
                primary: '#003d51',
                secondary: '#2183a2',
                accent: '#03b6bd',
                //error: '#81c6d4',
                error: '#e56b6f',
                info: '#e6e5df',
                success: '#2196F3',
                warning: '#FFC107',
                anchor: '#2183a2',
            },
            dark: {
            },
        }
    }
});

