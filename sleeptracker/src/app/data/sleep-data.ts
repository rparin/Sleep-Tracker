import { generate } from 'shortid';

export class SleepData {
	id:string;
	loggedAt:Date;

	constructor() {
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged entries the same).
		this.id = generate();
		this.loggedAt = new Date();
	}

	summaryString():string {
		return 'Unknown sleep data';
	}

	dateString():string {
		return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
