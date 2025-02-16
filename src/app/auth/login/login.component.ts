import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private supabase: SupabaseService, private router: Router) {
  }

  login() {
    this.supabase.signIn(this.email, this.password).then(({ data, error }) => {
      if (data) {
        console.log('Logged in successfully:', data);
        void this.router.navigate([ '/admin' ]);
      } else {
        console.error('Login failed:', error?.message);
      }
    });
  }
}
