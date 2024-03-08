export interface IUser {
	id: BigInt; // 64 bit number
	role: string;
	email: string;
	name: string;
	high_scores: {
		fishillionare_highscore: BigInt;
		foodfight_highscore: BigInt;
		dogeball_highscore: BigInt;
		thefloorislava_highscore: BigInt;
	};
	profile_picture_index: BigInt;
	visit_streak: BigInt;
	last_visit: string;
}

export interface IStudySetQuestion {
	question: string;
	answers: Array<string>;
}

export interface IStudySet {
	id: BigInt; // 64 bit number
	subject: string;
	questions: Array<IStudySetQuestion>;
}
