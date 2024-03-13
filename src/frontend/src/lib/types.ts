export interface IUser {
	id: bigint; // 64 bit number
	role: string;
	email: string;
	name: string;
	high_scores: {
		fishillionare_highscore: bigint;
		foodfight_highscore: bigint;
		dogeball_highscore: bigint;
		thefloorislava_highscore: bigint;
	};
	profile_picture_index: bigint;
	visit_streak: bigint;
	last_visit: string;
}

export interface IStudySetQuestion {
	question: string;
	answers: Array<string>;
}

export interface IStudySet {
	id: bigint; // 64 bit number
	subject: string;
	questions: Array<IStudySetQuestion>;
}
