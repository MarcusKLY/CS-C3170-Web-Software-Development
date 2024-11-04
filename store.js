let store = 0;

const setStore = (s) => store = s;

export function	getStore() {
		return store;
}

export { setStore };