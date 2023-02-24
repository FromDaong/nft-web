export default class Logger {
	config: LoggerConfig;
	constructor(config: LoggerConfig) {
		this.config = config;
	}

	private generateDate(): number {
		return this.config.date_format === "JS" ? Date.now() : Date.now() / 1000;
	}

	private serialize(data: any): string {
		return typeof data === "string" ? data : JSON.stringify(data);
	}

	static generateID(seed = 10) {
		return Math.floor(Math.random() * seed);
	}

	private generateLogEvent(data: {level: string; content: string}) {
		return {
			content: this.serialize(data.content),
			timestamp: this.generateDate(),
			id: Logger.generateID(10),
			level: data.level,
		};
	}

	log(content: any, level = "info") {
		console.info(this.generateLogEvent({level, content}));
	}

	success(content) {
		console.info(this.generateLogEvent({level: "success", content}));
	}

	info(content) {
		console.info(this.generateLogEvent({level: "info", content}));
	}

	warn(content) {
		console.warn(this.generateLogEvent({level: "warn", content}));
	}

	debug(content) {
		console.debug(this.generateLogEvent({level: "debug", content}));
	}

	fatal(content) {
		console.error(this.generateLogEvent({level: "fatal", content}));
	}

	trace(content) {
		console.trace(
			this.generateLogEvent({
				level: "fatal",
				content: `An error occured, here is the stack trace.\n\n${this.serialize(
					content
				)}`,
			})
		);
	}

	errorOccured(content) {
		this.fatal(`An error occured.\n${this.serialize(content)}`);
	}

	mutationSuccess(entity: string, initial: any, final: any) {
		this.success(
			`${entity} changed from ${this.serialize(initial)} to ${this.serialize(
				final
			)}`
		);
	}

	mutationFailed(entity: string, initial: any, final: any) {
		this.warn(
			`${entity} failed to update. \n\nFrom ${this.serialize(
				initial
			)} to ${this.serialize(final)}`
		);
	}

	private submit(data) {
		throw Error("NOT Implemented");
	}
}

export type LoggerConfig = {
	date_format: "UNIX" | "JS";
};
