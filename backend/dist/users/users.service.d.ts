import { DatabaseService } from '../database/database.service';
export declare class UsersService {
    private dbService;
    constructor(dbService: DatabaseService);
    getProfile(userId: number): Promise<{
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
    updateAllergies(userId: number, allergenDisplayNames: string[]): Promise<{
        message: string;
    }>;
    updateProfile(userId: number, updateDto: any): Promise<{
        message: string;
    }>;
}
