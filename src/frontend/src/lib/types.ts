export interface IUser {
	id: number;
	email: string;
	name: string;
	high_scores: {
		id: number;
		user: number;
		fishillionare_highscore: number;
		foodfight_highscore: number;
		dogeball_highscore: number;
		thefloorislava_highscore: number;
	};
	profile_picture_index: number;
}
