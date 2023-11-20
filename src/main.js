import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCirclePlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
library.add(faCirclePlus, faTrash, faXmark);

import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

import components from '@/assets/components/ui';

import '@/assets/styles/index.scss';

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
components.forEach((component) => app.component(component.name, component));
app.use(VueTippy, {
	directive: 'tippy',
	component: 'tippy',
	componentSingleton: 'tippy-singleton',
	defaultProps: {
		placement: 'auto-end',
		allowHTML: true,
	},
})
	.use(store)
	.use(router)
	.mount('#app');
