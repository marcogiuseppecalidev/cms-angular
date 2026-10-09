import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  user: any = null;

  constructor(private auth: Auth) { }

  ngOnInit() {

    console.log('Dashboard partita');

    this.auth.getUser().subscribe({

      next: (response: any) => {

        console.log('Utente autenticato');

        this.user = response.user;

      },

      error: (error) => {

        console.log('Errore:', error);

      }

    });

  }

}