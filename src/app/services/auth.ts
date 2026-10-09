import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Auth {

    private apiUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient) { }

    register(user: any) {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }

    getUser() {

        const token = this.getToken();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/user`, {
            headers: headers
        });
    }

}