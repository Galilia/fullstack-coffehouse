import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip', {static: false}) tooltipRef: ElementRef
  tooltip: MaterialInstance;
  oSub: Subscription;
  isFilterVisible: boolean = false;
  orders: Order[] = [];
  offset: number = 0;
  limit: number = STEP;
  loading: boolean = false;
  reloading = false;
  noMoreOrders = false;
  newFilter: Filter = {}

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.reloading = true;
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.newFilter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.getAllOrders(params).subscribe(ords => {
      this.orders = this.orders.concat(ords)
      this.noMoreOrders = ords.length < STEP
      this.loading = false;
      this.reloading = false;
    })
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  ngOnDestroy(): void {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch()
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.newFilter = filter;
    this.reloading = true;
    this.fetch()
  }

  isFiltered(): boolean {
    return Object.keys(this.newFilter).length !== 0
  }
}
