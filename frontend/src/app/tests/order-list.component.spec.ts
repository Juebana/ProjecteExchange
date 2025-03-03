import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrderListComponent } from '../components/order-list/order-list.component';
import { OrderService } from '../services/OrderService/order.service';
import { PriceService } from '../services/PriceService/price.service';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { UserDTO } from '../models/user.dto';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';
import { HttpHeaders } from '@angular/common/http';

// Mock User
const mockUser = new User(
  '123',               // _id
  'testuser',          // _username
  'password',          // _password
  'token'              // _token (optional)
);

// Mock Active Orders
const mockActiveOrders: Order[] = [
  Order.createOrder(
    '1',                // id
    '123',              // userId
    'buy',              // tradeSide
    'market',           // tradeType
    null,               // price
    null,               // limitPrice
    50000,              // executionPrice
    100,                // amount
    'usdc',             // currency
    'executed',         // status
    '2023-01-01T00:00:00Z' // createdAt
  ),
  Order.createOrder(
    '2',
    '123',
    'sell',
    'limit',
    null,
    55000,
    null,
    200,
    'usdc',
    'pending',
    '2023-01-02T00:00:00Z'
  )
];

// Mock History Orders
const mockHistoryOrders = [
  {
    id: '3',
    userId: '123',
    tradeSide: 'buy',
    tradeType: 'market',
    price: 51000,
    amount: 150,
    currency: 'usdc',
    created_at: '2023-01-03T00:00:00Z',
    closed_at: '2023-01-04T00:00:00Z',
    pnl: 20
  }
];

// Mock Services
class MockOrderService {
  getActiveOrders(userId: string) {
    return of(mockActiveOrders);
  }
  getOrderHistory(userId: string, page: number) {
    return of({ orders: mockHistoryOrders, totalPages: 2 });
  }
  executeOrder(orderId: string, currentPrice: number, headers: any) {
    return of({});
  }
  closeOrder(orderId: string, currentPrice: number, headers: any) {
    return of({});
  }
}

class MockPriceService {
  getCurrentPrice(symbol: string) {
    return of(55000); // Mock current price
  }
}

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let orderService: OrderService;
  let priceService: PriceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListComponent, CommonModule, CustomAlertComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: OrderService, useClass: MockOrderService },
        { provide: PriceService, useClass: MockPriceService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    priceService = TestBed.inject(PriceService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(UserDTO, 'fromJSONToUser').and.returnValue(mockUser);

    fixture.detectChanges();
  });

  // **Initialization Tests**
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user from localStorage and fetch active orders', () => {
    spyOn(component, 'fetchActiveOrders').and.callThrough();
    component.ngOnInit();
    expect(component.user).toEqual(mockUser);
    expect(component.fetchActiveOrders).toHaveBeenCalled();
    expect(component.activeOrders).toEqual(mockActiveOrders);
  });

  it('should start price subscription on init', () => {
    spyOn(component, 'startPriceSubscription').and.callThrough();
    component.ngOnInit();
    expect(component.startPriceSubscription).toHaveBeenCalled();
  });

  // **Tab Switching Tests**
  it('should switch to history tab and fetch order history', () => {
    spyOn(orderService, 'getOrderHistory').and.callThrough();
    component.activeTab = 'history';
    component.fetchOrderHistory();
    expect(orderService.getOrderHistory).toHaveBeenCalledWith('123', 1);
    expect(component.historyOrders).toEqual(mockHistoryOrders);
    expect(component.totalPages).toBe(2);
  });

  // **Order Fetching Tests**
  it('should fetch active orders when fetchActiveOrders is called', () => {
    spyOn(orderService, 'getActiveOrders').and.callThrough();
    component.fetchActiveOrders();
    expect(orderService.getActiveOrders).toHaveBeenCalledWith('123');
    expect(component.activeOrders).toEqual(mockActiveOrders);
  });

  it('should fetch order history when fetchOrderHistory is called', () => {
    spyOn(orderService, 'getOrderHistory').and.callThrough();
    component.fetchOrderHistory();
    expect(orderService.getOrderHistory).toHaveBeenCalledWith('123', 1);
    expect(component.historyOrders).toEqual(mockHistoryOrders);
  });

  // **Price Subscription Tests**
  it('should update current price every 5 seconds and check pending/auto-close orders', fakeAsync(() => {
    spyOn(component, 'checkPendingOrders').and.callThrough();
    spyOn(component, 'checkAutoCloseOrders').and.callThrough();
    
    component.startPriceSubscription();
    tick(5000); // Advance 5 seconds
    discardPeriodicTasks(); // Add this to clear the timer queue
    
    expect(component.currentPrice).toBe(55000);
    expect(component.checkPendingOrders).toHaveBeenCalled();
    expect(component.checkAutoCloseOrders).toHaveBeenCalled();
  }));

  it('should unsubscribe from price subscription on destroy', () => {
    component.startPriceSubscription();
    const unsubscribeSpy = spyOn(component.priceSubscription!, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  // **Pending Orders Tests**
  it('should execute pending buy order when current price <= limit price', fakeAsync(() => {
    component.currentPrice = 54000;
    
    // Create a NEW Order instance with modified properties
    const pendingOrder = Order.createOrder(
      '2',                // id
      '123',              // userId
      'buy',              // tradeSide (modified)
      'limit',            // tradeType
      null,               // price
      54000,              // limitPrice (modified)
      null,               // executionPrice
      200,                // amount
      'usdc',             // currency
      'pending',          // status
      '2023-01-02T00:00:00Z'
    );

    component.activeOrders = [pendingOrder];
    spyOn(orderService, 'executeOrder').and.callThrough();
    component.checkPendingOrders();
    expect(orderService.executeOrder).toHaveBeenCalledWith('2', 54000, jasmine.any(HttpHeaders));
  }));

  it('should execute pending sell order when current price >= limit price', fakeAsync(() => {
    component.currentPrice = 56000; // Above limitPrice of 55000
    spyOn(orderService, 'executeOrder').and.callThrough();
    component.checkPendingOrders();
    expect(orderService.executeOrder).toHaveBeenCalledWith('2', 56000, jasmine.any(HttpHeaders));
  }));

  // **PNL Calculation Tests**
  it('should calculate PNL correctly for executed buy order', () => {
    component.currentPrice = 55000;
    const order = mockActiveOrders[0]; // Buy order, executed at 50000
    const pnl = component.calculatePNL(order);
    expect(pnl).toBeCloseTo(100 * (55000 / 50000 - 1), 2); // 10% profit
  });

// **Pending Orders Tests**
  it('should execute pending buy order when current price <= limit price', fakeAsync(() => {
    component.currentPrice = 54000;
    
    // Create a NEW Order instance with modified properties
    const pendingOrder = Order.createOrder(
      '2',                // id
      '123',              // userId
      'buy',              // tradeSide (modified)
      'limit',            // tradeType
      null,               // price
      54000,              // limitPrice (modified)
      null,               // executionPrice
      200,                // amount
      'usdc',             // currency
      'pending',          // status
      '2023-01-02T00:00:00Z'
    );

    component.activeOrders = [pendingOrder];
    spyOn(orderService, 'executeOrder').and.callThrough();
    component.checkPendingOrders();
    expect(orderService.executeOrder).toHaveBeenCalledWith('2', 54000, jasmine.any(HttpHeaders));
  }));

  it('should return 0 PNL for pending order', () => {
    component.currentPrice = 55000;
    const order = mockActiveOrders[1]; // Pending order
    const pnl = component.calculatePNL(order);
    expect(pnl).toBe(0);
  });

// **Auto-Close Orders Tests**
it('should auto-close order when PNL <= -amount', fakeAsync(() => {
  // Create a vulnerable order
  const vulnerableOrder = Order.createOrder(
    '1',
    '123',
    'buy',
    'market',
    null,
    null,
    100, // Execution price
    100, // Amount
    'usdc',
    'executed',
    '2023-01-01T00:00:00Z'
  );
  
  component.activeOrders = [vulnerableOrder];
  component.currentPrice = 0; // Price drops to 0 for 100% loss
  
  spyOn(orderService, 'closeOrder').and.callThrough();
  component.checkAutoCloseOrders();
  
  expect(orderService.closeOrder).toHaveBeenCalledWith('1', 0, jasmine.any(HttpHeaders));
}));

  // **User Interaction Tests**
  it('should close an order and show alert when closeOrder is called', () => {
    component.currentPrice = 55000;
    const order = mockActiveOrders[0];
    spyOn(orderService, 'closeOrder').and.callThrough();
    component.closeOrder(order);
    expect(orderService.closeOrder).toHaveBeenCalledWith('1', 55000, jasmine.any(HttpHeaders));
    expect(component.showAlert).toBeTrue();
    expect(component.alertMessage).toBe('Order 1 closed successfully.');
  });

  it('should dismiss alert when dismissAlert is called', () => {
    component.showAlert = true;
    component.dismissAlert();
    expect(component.showAlert).toBeFalse();
  });

  // **HTML Rendering Test**
  it('should render all key HTML elements correctly', () => {
    const compiled = fixture.nativeElement;

    // Check tabs
    const tabButtons = compiled.querySelectorAll('.tabs button');
    expect(tabButtons.length).toBe(2);
    expect(tabButtons[0].textContent).toContain('Active Orders');
    expect(tabButtons[1].textContent).toContain('Order History');

    // Check active orders table
    const activeOrdersSection = compiled.querySelector('.active-orders');
    expect(activeOrdersSection).toBeTruthy();
    const activeTableRows = activeOrdersSection.querySelectorAll('tbody tr');
    expect(activeTableRows.length).toBe(2); // Two mock active orders

    // Switch to history tab
    component.activeTab = 'history';
    component.fetchOrderHistory();
    fixture.detectChanges();

    // Check history orders table
    const historyOrdersSection = compiled.querySelector('.order-history');
    expect(historyOrdersSection).toBeTruthy();
    const historyTableRows = historyOrdersSection.querySelectorAll('tbody tr');
    expect(historyTableRows.length).toBe(1); // One mock history order

    // Check pagination
    const pagination = historyOrdersSection.querySelector('.pagination');
    expect(pagination).toBeTruthy();
    expect(pagination.querySelectorAll('button').length).toBe(2); // Previous and Next buttons
    expect(pagination.textContent).toContain('Page 1 of 2');

    // Check custom alert (initially hidden)
    const alert = compiled.querySelector('app-custom-alert');
    expect(alert).toBeTruthy();
  });
});