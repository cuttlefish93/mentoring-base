import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { YellowCartDirective } from '../directives/yellow-cart.directive';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

const getMenuItemName = (name: string) => name;
const aboutCompanyName = getMenuItemName('О компании');

const menuItems = [
  'Каталог',
  'Стройматериалы',
  'Инструменты',
  'Электрика',
  'Интерьер и одежда',
].map((item) => item.toUpperCase());

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [NgFor, RouterLink, DatePipe, YellowCartDirective, AsyncPipe, NgIf],
})
export class HeaderComponent {
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  readonly userService = inject(UserService);
  readonly router = inject(Router);
  public aboutCompany = aboutCompanyName;
  private isUpperCaseText = true;
  public menuItems = menuItems;
  public currentDate = new Date();

  public changeMenuText() {
    this.menuItems = menuItems.map((item) =>
      this.isUpperCaseText ? item.toLowerCase() : item.toUpperCase()
    );

    this.isUpperCaseText = !this.isUpperCaseText;
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  public checkAuthorization() {
    if (this.userService.isAdmin() === false) {
      this.openSnackBar('Страница доступна только для админа', '');
    }
    if (this.userService.isAdmin() === undefined) {
      this.openSnackBar('Вам необходимо войти!', '');
    }
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

  public openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res === 'user') {
          this.userService.loginAsUser();
        } else {
          this.userService.loginAsAdmin();
        }
      }
      console.log(this.userService.isUserLogged);
    });
  }
}
