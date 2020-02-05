import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {error} from "util";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal', {static:false}) modalRef: ElementRef
  isRoot: boolean;
  modal: MaterialInstance;
  oSub: Subscription;
  pending: boolean = false

  constructor(private router: Router,
              private order: OrderService,
              private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })

  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    this.modal.destroy()
    if(this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    this.pending = true;
    const newOrder: Order = {
      list: this.order.list.map(i => {
        delete i._id //потому что бэкэнд не принимает Айди ( не знает что это ), поэтому его надо убрать из массива
        return i
      })
    }
    this.oSub = this.ordersService.create(newOrder).subscribe(
      orderNew => {
        MaterialService.toast(`Заказ #${orderNew.order} был добавлен`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close()
        this.pending = false
      }
    )
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item);
  }
}
