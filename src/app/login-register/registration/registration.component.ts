import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  signUpForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  constructor(private authService: AuthService) {

  }

  async tempRegister() {
    console.log(this.signUpForm.value.username);
    console.log(this.signUpForm.value.email);
    console.log(this.signUpForm.value.password);
    console.log(this.signUpForm.value.confirmPassword);
    console.log("Registration in progress...");

    const email = this.signUpForm.value.email || ''; // Assign an empty string if email is undefined
    const password = this.signUpForm.value.password || ''; // Assign an empty string if password is undefined

    await this.authService.spawnNewUserWithEmailAndPassword(email, password);
    await this.authService.logout();
  }
  

}
