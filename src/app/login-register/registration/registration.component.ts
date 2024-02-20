import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required,
      Validators.minLength(4), Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9]*$'),
      forbiddenNameValidator(/admin/i),
      forbiddenNameValidator(/support/i),
    ]
    ),
    email: new FormControl('',
      [Validators.required, Validators.email]
    ),
    password: new FormControl('', [Validators.required,
      Validators.minLength(6), Validators.maxLength(20), 
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)]    
    ),
    confirmPassword: new FormControl('', [Validators.required,
      Validators.minLength(6) 
    ],)
  },);

  constructor(private authService: AuthService) {

  }

  pswdMatch(){
    if(this.signUpForm.value.password != this.signUpForm.value.confirmPassword){
      return false
    }
    return true
  }

  async registerWithEmailAndPswd() {
    const email = this.signUpForm.value.email || ''; // Assign an empty string if email is undefined
    const password = this.signUpForm.value.password || ''; // Assign an empty string if password is undefined
    try{
      await this.authService.spawnNewUserWithEmailAndPassword(email, password);
      await this.authService.logout();
    } catch(error) {
      console.error(error);
    }

  }

  async tempRegister() {
    console.log(this.signUpForm.value.username);
    console.log(this.signUpForm.value.email);
    console.log(this.signUpForm.value.password);
    console.log(this.signUpForm.value.confirmPassword);
    console.log("Registration in progress...");
    console.log(this.pswdMatch());

  }
}

/** can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}