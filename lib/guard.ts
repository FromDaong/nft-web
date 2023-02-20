// Is a singleton

export default class Guard {
	static instance: Guard;

	private constructor() {}

	static getInstance() {
		if (!Guard.instance) Guard.instance = new Guard();
		return Guard.instance;
	}

	notNull(param: any) {
		return param !== null;
	}

	isDefined(param: any) {
		return typeof param !== undefined;
	}

	exists(param: any) {
		return this.notNull(param) && this.isDefined(param);
	}
}
