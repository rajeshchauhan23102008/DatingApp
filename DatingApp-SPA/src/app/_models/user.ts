import { Photo } from './photo';

export interface User {

    id: number;
    userName: string;
    gender: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    photoUrl: string;

    Introduction?: string;
    lookingFor?: string;
    interests?: string;
    photos?: Photo[];
}