export interface IUser {
	id: number;
	email: string;
	name: string;
	high_scores: {
		fishillionare_highscore: number;
		foodfight_highscore: number;
		dogeball_highscore: number;
		thefloorislava_highscore: number;
	};
	profile_picture_index: number;
	visit_streak: number;
	last_visit: string;
}
