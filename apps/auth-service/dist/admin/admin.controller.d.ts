export declare class AdminController {
    ping(user: any): {
        message: string;
        user: {
            id: any;
            email: any;
            roles: any;
        };
        timestamp: Date;
    };
    dashboard(user: any): {
        message: string;
        user: any;
        roles: any;
    };
}
