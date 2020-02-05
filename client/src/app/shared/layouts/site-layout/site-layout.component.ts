import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating', {static: false}) floatingRef: ElementRef;

  links = [
    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналитика'},
    {url: '/history', name: 'История'},
    {url: '/order', name: 'Добавить заказ'},
    {url: '/categories', name: 'Ассортимент'},
  ]

  constructor(private auth: AuthService,
              private router: Router) {
  }

  logout(event: Event) {
    event.preventDefault(); //to lock auto reload page on click
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }
}
