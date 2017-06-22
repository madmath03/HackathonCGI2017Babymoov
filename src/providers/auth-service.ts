import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

export class User {
    email: string;
    password: string;

    constructor(email: string, password: string = null) {
        this.email = email;
        this.password = password;
    }
}

@Injectable()
export class AuthService {
    currentUser: User;

    public login(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw('Renseignez les informations');
        } else {
            return Observable.create(observer => {
                // At this point make a request to your backend to make a real check!
                let access = (credentials.password === 'password' && credentials.email === 'email');
                this.currentUser = new User('Winner', 'winner@babymoov.fr');
                observer.next(access);
                observer.complete();
            });
        }
    }

    public register(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw('Renseignez les informations');
        } else {
            // At this point store the credentials to your backend!
            return Observable.create(observer => {
                observer.next(true);
                observer.complete();
            });
        }
    }

    public getUserInfo(): User {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
            observer.next(true);
            observer.complete();
        });
    }
}