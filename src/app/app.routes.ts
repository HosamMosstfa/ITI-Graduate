import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login';
import { RegisterComponent } from './account/register/register';
import { VerifyEmailComponent } from './account/verify-email/verify-email';
// Import new components
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password';
import { ResetCodeComponent } from './account/reset-code/reset-code';
import { NewPasswordComponent } from './account/new-password/new-password';
import { CompleteRegistrationComponent } from './account/complete-registration/complete-registration';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },

  // Add Complete Registration Route
  { path: 'complete-registration', component: CompleteRegistrationComponent },

  // Forgot Password Flow
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-code', component: ResetCodeComponent },
  { path: 'new-password', component: NewPasswordComponent },
];
