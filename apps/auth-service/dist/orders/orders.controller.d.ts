export declare class OrdersController {
    ping(user: any): {
        message: string;
        user: {
            id: any;
            email: any;
            permissions: any;
        };
        timestamp: Date;
    };
    create(user: any): {
        message: string;
        createdBy: any;
    };
}
