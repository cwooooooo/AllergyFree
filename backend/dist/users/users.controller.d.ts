import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: any;
        email: any;
        username: any;
        name: any;
        phone: any;
        birthdate: any;
        gender: any;
        recipient_name: any;
        address: any;
        detail_address: any;
        zipcode: any;
        contact_phone: any;
        created_at: any;
        allergies: {
            id: any;
            name: any;
            display_name: any;
            severity: any;
        }[];
    }>;
    updateAllergies(req: any, body: {
        allergies: string[];
    }): Promise<{
        message: string;
    }>;
    updateProfile(req: any, body: any): Promise<{
        message: string;
    }>;
}
