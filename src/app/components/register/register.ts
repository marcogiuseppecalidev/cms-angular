import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {

  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';

  constructor(private auth: Auth) { }

  register() {

    if (this.name.trim() === '') {
      console.log('Il nome è obbligatorio');
      return;
    }

    if (this.email.trim() === '') {
      console.log('La email è obbligatoria');
      return;
    }

    if (this.password.trim() === '') {
      console.log('La password è obbligatoria');
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      console.log('Le password non coincidono');
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.auth.register(user).subscribe({
      next: (response) => {
        console.log('Registrazione completata!');
        console.log(response);
      },
      error: (error) => {
        console.log('Errore durante la registrazione');
        console.log(error);
      }
    });
  }
}

error: (error: any) => {
  console.log('Errore durante la registrazione');
  console.log(error);
  console.log(error.error);
}