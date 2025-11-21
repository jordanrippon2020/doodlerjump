import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ScoreEntry {
    userId: string;
    username: string;
    score: number;
    timestamp: Timestamp;
    photoURL: string | null;
}

export class Leaderboard {
    async submitScore(userId: string, username: string, score: number, photoURL: string | null) {
        try {
            await addDoc(collection(db, 'scores'), {
                userId,
                username,
                score,
                timestamp: Timestamp.now(),
                photoURL
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async getTopScores(limitCount: number = 10): Promise<ScoreEntry[]> {
        const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);
        const scores: ScoreEntry[] = [];
        querySnapshot.forEach((doc) => {
            scores.push(doc.data() as ScoreEntry);
        });
        return scores;
    }
}
