import { collection, addDoc, query, orderBy, limit, getDocs, where, updateDoc, Timestamp } from 'firebase/firestore';
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
            // Check if user already has a score
            const q = query(collection(db, 'scores'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // User has existing score(s), check if new score is higher
                const existingDoc = querySnapshot.docs[0];
                const existingScore = existingDoc.data().score;

                if (score > existingScore) {
                    // Update with new high score
                    await updateDoc(existingDoc.ref, {
                        score,
                        username,
                        timestamp: Timestamp.now(),
                        photoURL
                    });
                }
                // If score is not higher, don't update
            } else {
                // New user, add their score
                await addDoc(collection(db, 'scores'), {
                    userId,
                    username,
                    score,
                    timestamp: Timestamp.now(),
                    photoURL
                });
            }
        } catch (e) {
            console.error("Error adding/updating document: ", e);
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
